import os

from groq import Groq
import json

client = Groq(
    api_key=os.environ["GROQ_API_KEY"],
)

def create_image_description(char, definition):
    user_message = f"{char}"
    chat_completion = client.chat.completions.create(
        messages=[
            {
                "role": "system",
                "content": """I want you to come up with image descriptions based on the meaning of a chinese character. Image descriptions should
                really capture the meaning behind the character. If a character describes something very abstract, transform it into a concrete and simple scene.
                Also always add a creative style to the image. Be rather brief and direct with the description, the image generation model does not understand complex scenes. But be long and creative with the style. Only output the image description, nothing else.
                Here are a few examples:

                user:
                飽
                assistant:
                Person with big belly, looking satisfied, sitting on table with only scraps of meal left
                style: glassmorphism style, artistic abstract fashion photo of a handsome man, liquid glass, trending on Artstation,

                user:
                親

                assistant:
                small boy in-between his parents Style: 8 k resolution, extremely detailed, beautiful, establishing shot, artistic, octane render, cinematic lighting, dramatic lighting,

                user:
                情
                assistant:
                colorful, intricate detailed, artistic heart. Style: watercolor painting. beautiful

                user:
                的

                assistant:
                dagobert duck standing on his big pile of coins. style: comic book, illustration, funny, detailed

                user:
                辦

                assistant:
                A man sitting in front of a office desk being very busy with paperwork. style: low poly style,

                user:
                三
                assistant:
                Three mountains. Style: breathtaking 4K landscape, cinematic cloudscape, soft focus, golden hour lighting, subtle motion blur.

                user:
                關
                assistant:
                A big closed wooden door. Style: middle ages, japanese ink painting, minimal



                """,
            },
            {
                "role": "user",
                "content": user_message ,
            }
        ],
        model="llama3-8b-8192",
    )
    image_description  = chat_completion.choices[0].message.content
    return image_description

character_data = []
with open('character_data.jsonl', 'r', encoding='utf-8') as f:
    for line in f:
        character_data.append(json.loads(line))


for i in range(100, 300):
    char = character_data[i]['char']
    definition = character_data[i]['definition']
    image_description = create_image_description(char, definition)
    character_data[i]['image_description'] = image_description
    print(image_description)


with open('character_data.jsonl', 'w', encoding='utf-8') as f:
    for item in character_data:
        json.dump(item, f, ensure_ascii=False)
        f.write('\n')