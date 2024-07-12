# ---
# output-directory: "/tmp/stable-diffusion-xl"
# args: ["--prompt", "An astronaut riding a green horse"]
# runtimes: ["runc", "gvisor"]
# ---
# # Stable Diffusion XL 1.0
#
# This example is similar to the [Stable Diffusion CLI](/docs/examples/stable_diffusion_cli)
# example, but it generates images from the larger SDXL 1.0 model. Specifically, it runs the
# first set of steps with the base model, followed by the refiner model.
#
# [Try out the live demo here!](https://modal-labs--stable-diffusion-xl-app.modal.run/) The first
# generation may include a cold-start, which takes around 20 seconds. The inference speed depends on the GPU
# and step count (for reference, an A100 runs 40 steps in 8 seconds).

# ## Basic setup

import io
from pathlib import Path

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

# ## Define a container image
#
# To take advantage of Modal's blazing fast cold-start times, we'll need to download our model weights
# inside our container image with a download function. We ignore binaries, ONNX weights and 32-bit weights.
#
# Tip: avoid using global variables in this function to ensure the download step detects model changes and
# triggers a rebuild.


omost_image = (
    Image.debian_slim(python_version="3.10")
    .apt_install(
        "libglib2.0-0", "libsm6", "libxrender1", "libxext6", "ffmpeg", "libgl1"
    )
    .pip_install(
        "diffusers==0.28.0",
        "transformers==4.41.1",
        "gradio==4.31.5",
        "bitsandbytes==0.43.1",
        "accelerate==0.30.1",
        "protobuf==3.20",
        "opencv-python",
        "tensorboardX",
        "safetensors",
        "pillow",
        "einops",
        "torch",
        "peft",
    )
)

app = App(
    "omost"
)  # Note: prior to April 2024, "app" was called "stub"

with sdxl_image.imports():
    import torch
    from diffusers import DiffusionPipeline
    from fastapi import Response
    import uuid
    import time
    import torch
    import numpy as np
    import gradio as gr
    import tempfile
    from threading import Thread
    from PIL import Image

# ## Load model and run inference
#
# The container lifecycle [`@enter` decorator](https://modal.com/docs/guide/lifecycle-functions#container-lifecycle-beta)
# loads the model at startup. Then, we evaluate it in the `run_inference` function.
#
# To avoid excessive cold-starts, we set the idle timeout to 240 seconds, meaning once a GPU has loaded the model it will stay
# online for 4 minutes before spinning down. This can be adjusted for cost/experience trade-offs.


@app.cls(gpu=gpu.A10G(), container_idle_timeout=240, image=sdxl_image)
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
            "SG161222/RealVisXL_V4.0", ignore_patterns=ignore
        )
        snapshot_download(
            "lllyasviel/omost-llama-3-8b",
            ignore_patterns=ignore,
        )

    @enter()
    def enter(self):
        load_options = dict(
            torch_dtype=torch.float16,
            use_safetensors=True,
            variant="fp16",
            device_map="auto",
        )

        tokenizer = CLIPTokenizer.from_pretrained(
            sdxl_name, subfolder="tokenizer")
        tokenizer_2 = CLIPTokenizer.from_pretrained(
            sdxl_name, subfolder="tokenizer_2")
        text_encoder = CLIPTextModel.from_pretrained(
            sdxl_name, subfolder="text_encoder", torch_dtype=torch.float16, variant="fp16")
        text_encoder_2 = CLIPTextModel.from_pretrained(
            sdxl_name, subfolder="text_encoder_2", torch_dtype=torch.float16, variant="fp16")
        vae = AutoencoderKL.from_pretrained(
            sdxl_name, subfolder="vae", torch_dtype=torch.bfloat16, variant="fp16")  # bfloat16 vae
        unet = UNet2DConditionModel.from_pretrained(
            sdxl_name, subfolder="unet", torch_dtype=torch.float16, variant="fp16")

        unet.set_attn_processor(AttnProcessor2_0())
        vae.set_attn_processor(AttnProcessor2_0())

        pipeline = StableDiffusionXLOmostPipeline(
            vae=vae,
            text_encoder=text_encoder,
            tokenizer=tokenizer,
            text_encoder_2=text_encoder_2,
            tokenizer_2=tokenizer_2,
            unet=unet,
            scheduler=None,  # We completely give up diffusers sampling system and use A1111's method
        )

        memory_management.unload_all_models([text_encoder, text_encoder_2, vae, unet])

        # LLM

        # llm_name = 'lllyasviel/omost-phi-3-mini-128k-8bits'
        llm_name = 'lllyasviel/omost-llama-3-8b-4bits'
        # llm_name = 'lllyasviel/omost-dolphin-2.9-llama3-8b-4bits'

        llm_model = AutoModelForCausalLM.from_pretrained(
            llm_name,
            torch_dtype=torch.bfloat16,  # This is computation type, not load/memory type. The loading quant type is baked in config.
            token=HF_TOKEN,
            device_map="auto"  # This will load model to gpu with an offload system
        )

        llm_tokenizer = AutoTokenizer.from_pretrained(
            llm_name,
            token=HF_TOKEN
        )

        memory_management.unload_all_models(llm_model)
    
    @torch.inference_mode()
    def pytorch2numpy(imgs):
        results = []
        for x in imgs:
            y = x.movedim(0, -1)
            y = y * 127.5 + 127.5
            y = y.detach().float().cpu().numpy().clip(0, 255).astype(np.uint8)
            results.append(y)
        return results


    @torch.inference_mode()
    def numpy2pytorch(imgs):
        h = torch.from_numpy(np.stack(imgs, axis=0)).float() / 127.5 - 1.0
        h = h.movedim(-1, 1)
        return h


    def resize_without_crop(image, target_width, target_height):
        pil_image = Image.fromarray(image)
        resized_image = pil_image.resize((target_width, target_height), Image.LANCZOS)
        return np.array(resized_image)

    def _inference(self, prompt, n_steps=24, high_noise_frac=0.8):
        negative_prompt = "ugly, deformed, noisy, blurry, distorted, grainy, disfigured"
        image = self.base(
            prompt=prompt,
            negative_prompt=negative_prompt,
            num_inference_steps=n_steps,
            denoising_end=high_noise_frac,
            output_type="latent",
        ).images
        image = self.refiner(
            prompt=prompt,
            negative_prompt=negative_prompt,
            num_inference_steps=n_steps,
            denoising_start=high_noise_frac,
            image=image,
        ).images[0]

        byte_stream = io.BytesIO()
        image.save(byte_stream, format="JPEG")

        return byte_stream

    @method()
    def inference(self, prompt, n_steps=24, high_noise_frac=0.8):
        return self._inference(
            prompt, n_steps=n_steps, high_noise_frac=high_noise_frac
        ).getvalue()

    @web_endpoint()
    def web_inference(self, prompt, n_steps=24, high_noise_frac=0.8):
        return Response(
            content=self._inference(
                prompt, n_steps=n_steps, high_noise_frac=high_noise_frac
            ).getvalue(),
            media_type="image/jpeg",
        )


# And this is our entrypoint; where the CLI is invoked. Explore CLI options
# with: `modal run stable_diffusion_xl.py --help

import json
import os
import random
import string
@app.local_entrypoint()
def main(prompt: str = "Unicorns and leprechauns sign a peace treaty"):
    data = []
    with open('character_data.jsonl', 'r', encoding='utf-8') as f:
        for line in f:
            data.append(json.loads(line))

    # Get the lines in the range of 120 to 125

    with open('character_indices.txt', 'r') as f:
        indices = [int(line.strip()) for line in f]
    
    selected_lines = data[300:400]
    indices = [i for i in range(400, 1000)]
    for i, index in enumerate(indices):
      print(i)
      line = data[index]
      try: 
        image_bytes = Model().inference.remote(line['image_description'])
      except:
        continue
      dir = Path(r"C:\Users\Dennis\Documents\Hobby\smOOthi\static\images3")
      if not dir.exists():
          dir.mkdir(exist_ok=True, parents=True)

      char = line['char'].strip()
      base_filename = f"{char}.png"
      output_path = dir / base_filename
    #   if output_path.exists():
      if True:
            random_string = ''.join(random.choices(string.ascii_lowercase + string.digits, k=7))
            output_path = os.path.join(dir, f"{char}_{random_string}.png")
      print(f"Saving it to {output_path}")
      with open(output_path, "wb") as f:
          f.write(image_bytes)


# ## A user interface
#
# Here we ship a simple web application that exposes a front-end (written in Alpine.js) for
# our backend deployment.
#
# The Model class will serve multiple users from a its own shared pool of warm GPU containers automatically.
#
# We can deploy this with `modal deploy stable_diffusion_xl.py`.

# frontend_path = Path(__file__).parent / "frontend"

# web_image = Image.debian_slim().pip_install("jinja2")


# @app.function(
#     image=web_image,
#     mounts=[Mount.from_local_dir(frontend_path, remote_path="/assets")],
#     allow_concurrent_inputs=20,
# )
# @asgi_app()
# def ui():
#     import fastapi.staticfiles
#     from fastapi import FastAPI, Request
#     from fastapi.templating import Jinja2Templates

#     web_app = FastAPI()
#     templates = Jinja2Templates(directory="/assets")

#     @web_app.get("/")
#     async def read_root(request: Request):
#         return templates.TemplateResponse(
#             "index.html",
#             {
#                 "request": request,
#                 "inference_url": Model.web_inference.web_url,
#                 "model_name": "Stable Diffusion XL",
#                 "default_prompt": "A cinematic shot of a baby raccoon wearing an intricate italian priest robe.",
#             },
#         )

#     web_app.mount(
#         "/static",
#         fastapi.staticfiles.StaticFiles(directory="/assets"),
#         name="static",
#     )

#     return web_app
