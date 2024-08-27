import io
from pathlib import Path
import modal

from modal import (
    App,
    Image,
    Mount,
    asgi_app,
    build,
    enter,
    gpu,
    method,
    web_endpoint,
)

flux_image = (
    Image.debian_slim(python_version="3.10")
    .apt_install(
        "libglib2.0-0", "libsm6", "libxrender1", "libxext6", "ffmpeg", "libgl1"
    )
    .pip_install(
        "diffusers",
        "transformers",
        "accelerate",
        "safetensors",
        "sentencepiece"
    )
)

app = App(
    "stable-diffusion-xl"
)  # Note: prior to April 2024, "app" was called "stub"

with flux_image.imports():
    import torch
    from diffusers import DiffusionPipeline
    from fastapi import Response


@app.cls(gpu=gpu.A100(), container_idle_timeout=240, image=flux_image)
class Model:
    @build()
    def build(self):
        from huggingface_hub import snapshot_download

        ignore = [
            "*.bin",
            "*.onnx_data",
            "*/diffusion_pytorch_model.safetensors",
        ]
        snapshot_download(
            "black-forest-labs/FLUX.1-schnell", ignore_patterns=ignore
        )


    @enter()
    def enter(self):
        load_options = dict(
            torch_dtype=torch.bfloat16,
            use_safetensors=True,
            # variant="fp16",
        )

        device = "cuda" if torch.cuda.is_available() else "cpu"

        # Load base model
        self.base = DiffusionPipeline.from_pretrained(
            "black-forest-labs/FLUX.1-schnell", **load_options
        ).to(device)

    def _inference(self, prompt, n_steps=4):
        # negative_prompt = "ugly, deformed, noisy, blurry, distorted, grainy, disfigured"
        image = self.base(
            prompt=prompt,
            # negative_prompt=negative_prompt,
            num_inference_steps=n_steps,
            output_type="pil",
            guidance_scale=0.0,
            width = 1024,
            height = 1024,
        ).images[0]

        img_byte_arr = io.BytesIO()
        image.save(img_byte_arr, format='PNG')
        img_byte_arr.seek(0)

        return img_byte_arr

    @modal.method()
    def inference(self, prompt, n_steps=4):
        return self._inference(
            prompt, n_steps=n_steps
        ).getvalue()

    @modal.web_endpoint(method="POST")
    def web_inference(self, data: dict):
        return Response(
            content=self._inference(
                 data.get("prompt"), n_steps=4
            ).getvalue(),
            media_type="image/png",
        )