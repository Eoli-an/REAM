import os

from groq import Groq
import json

client = Groq(
    api_key=os.environ["GROQ_API_KEY"],
)

system_message_v1 = """I want you to come up with image descriptions based on the meaning of a chinese character. Image descriptions should
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



                """;

system_message_v2 = """You will receive a Chinese character. Do the following, each step briefly:
1. State the meaning of the character
2. State the most common meaning of the character. This can include multiple words if the words are very related
3. State an example of how the most common meaning of the character would be used in a sentence.
4. Based on the previous information, think about how you could visualize the most common meaning of this character in a single image. Be straight-forward here
5. Create a detailed prompt for an image generation model for that visualization. Be straight-forward with the scene(the image model can not understand complex prompts), but delicate and detailed with the style. Be varied (think of themes like watercolor, chinese ink, glassmorphism, papercraft, romantic, etc be super creative here)in the style and make the style a long list of adjectives

DO NOT include anything else in your response, stick strictly to the format in the examples (I will programatically parse the responses)
Examples:
USER:
拿
ASSISTANT:
1. **Meaning:** To take, to hold, to grab
2. **Most Common Meaning:** To take, to hold
3. **Example:** 他拿了一本书。 (Tā ná le yī běn shū.)  He took a book.
4. **Visualization:** A hand reaching out to grasp an object, like a book or a cup.
5. **Prompt:**  A hand grabbing a book. Style: pixel art, beautiful, artistic

USER:
晨
ASSISTANT:
1. **Meaning:** Morning, dawn
2. **Most Common Meaning:** Morning
3. **Example:** 今天早上我吃了一个鸡蛋。(Jīntiān zǎoshang wǒ chī le yī ge jīdàn.)  This morning I ate an egg.
4. **Visualization:**  A sunrise over a landscape, perhaps with mountains or a field in the foreground. 
5. **Prompt:** A vibrant sunrise over a field of wildflowers with rolling hills in the background. Style: soft watercolor, dreamy, light and airy

USER:
駕
ASSISTANT:
1. **Meaning:** To drive, to ride, to operate
2. **Most Common Meaning:** To drive, to operate a vehicle
3. **Example:** 他會駕駛汽車。(Tā huì jiàshǐ qìchē.) He can drive a car.
4. **Visualization:**  A person sitting at the wheel of a car, driving.
5. **Prompt:** A person sitting behind the wheel of a vintage car, driving down a winding road. Style:  retro, warm-toned, muted colors, soft-focus, dreamy, nostalgic, vintage, film grain, sun-drenched, cinematic, textured, vibrant, detailed, realistic. 

USER:
料
ASSISTANT:
1. **Meaning:** Material, stuff, matter, information
2. **Most Common Meaning:** Material, stuff, information
3. **Example:** 这件衣服的料子很好。(Zhè jiàn yīfu de liàozi hěn hǎo.) The material of this garment is very good.
4. **Visualization:** A pile of colorful fabrics or a table covered in raw materials
5. **Prompt:** A table piled high with colorful fabrics, yarn, thread, beads, and other craft materials.  Style: realistic, vibrant colors, warm lighting, slightly blurry background

USER:
郎
ASSISTANT:
1. **Meaning:** Young man, husband
2. **Most Common Meaning:** Husband
3. **Example:** 我丈夫是一个好人。(Wǒ zhàngfu shì yī ge hǎo rén.) My husband is a good person.
4. **Visualization:** A man in a suit, standing proudly with a confident expression, perhaps holding a bouquet of flowers. 
5. **Prompt:** A man in a dapper suit, standing tall and smiling, holding a bouquet of red roses. Style: photorealistic, vintage, warm lighting, classic, elegant, timeless, romantic, soft-focus background. 

USER:
助
ASSISTANT:
1. **Meaning:** To help, to assist, to aid
2. **Most Common Meaning:** To help, to assist
3. **Example:** 他帮助我搬家。(Tā bāngzhù wǒ bānjiā.) He helped me move.
4. **Visualization:** Two hands, holding each other
5. **Prompt:** A hand holding another hand. Style:  Watercolor, soft, delicate, pastel, dreamy, ethereal, blurred, textured, handmade, gentle, light, muted, lavender, blue, subtle, glow, warm, romantic, whimsical, gentle, hopeful, compassionate, supportive 

USER:
遠
ASSISTANT:
1. **Meaning:** Far, distant, remote
2. **Most Common Meaning:** Far, distant 
3. **Example:** 那座山很远。(Nà zuò shān hěn yuǎn.) That mountain is very far away.
4. **Visualization:** A lone figure standing on a hilltop, looking out at a vast, distant landscape. 
5. **Prompt:** A lone figure standing on a grassy hilltop, silhouetted against the setting sun, looking out at a vast, distant mountain range. Style:  impressionistic, soft-focused, warm-toned, dreamy, peaceful, hazy, atmospheric, textured, minimalist, contemplative, ethereal, brushstrokes, light, airy, faded. """


def create_image_description(char, definition):
    user_message = f"{char}"
    chat_completion = client.chat.completions.create(
        messages=[
            {
                "role": "system",
                "content": system_message_v2,
            },
            {
                "role": "user",
                "content": user_message ,
            }
        ],
        model="llama3-8b-8192",
        temperature=1.0,
    )
    image_description  = chat_completion.choices[0].message.content
    image_description = image_description.split("**Prompt:** ")[1]
    return image_description

character_data = []
with open('character_data.jsonl', 'r', encoding='utf-8') as f:
    for line in f:
        character_data.append(json.loads(line))

characters_to_find = ['里', '維', '非', '正', '最', '高', '男', '她', '比', '過', '兒', '年', '面', '己', '麼', '暗', '開', '天', '注', '意', '起', '轉', '讀', '四', '號', '說', '完', '全', '任', '何', '神', '情', '八', '格', '倫', '寧', '斯', '公', '老', '脖', '金', '平', '間', '圍', '牆', '視', '鄰', '居', '孩', '要', '密', '心', '恐', '懼', '裝', '對', '怎', '從', '離', '就', '像', '樣', '灰', '早', '晨', '始', '外', '並', '給', '快', '將', '興', '嘗', '色', '分', '拿', '氣', '彎', '件', '-', '所', '以', '再', '次', '回', '站', '駕', '然', '搖', '駛', '城', '鎮', '考', '能', '近', '停', '交', '通', '斗', '篷', '異', '服', '輕', '愚', '蠢', '流', '些', '其', '!', '住', '豪', '謝', '你', '料', '涉', '及', '或', '相', '信', '胡', '司', '闆', '裡', '產', '強', '壯', '鬍', '瘦', '削', '髮', '女', '郎', '長', '幫', '助', '花', '監', '更', '好', '擁', '切', '藏', '與', '關', '聯', '實', '假', '立', '擔', '如', '果', '知', '遠', '另', '原', '讓', '成', '朋', '友', '星', '期', '二', '醒', '我', '故', '空', '示', '整', '國', '哼', '歌', '曲', '選', '擇', '無', '趣', '領', '帶', '去', '班', '聊', '餵', '養', '坐', '椅', '卻', '尖', '叫', '誰', '型', '黃', '鷹', '飛', '窗', '點', '三', '十', '包', '速', '臉', '頰', '吻', '跟', '別', '脾', '麥', '片', '拋', '壁', '「', '傢', '伙', '」', '咧', '嘴', '笑', '門', '倒', '似', '乎', '瞬', '明', '白', '虎', '斑', '角', '蹤', '跡', '剛', '纔', '什', '?', '定', '光', '線', '錯', '覺', '眨', '眼', '盯', '理', '緒', '路', '鏡', '標', '誌', '忘', '記', '批', '訂', '單', '希', '夠', '接', '邊', '緣', '止', '堵', '塞', '禁', '周', '討', '厭', '身', '衣', '新', '尚', '潮', '敲', '擊', '方', '盤', '手', '指', '附', '羣', '奮', '彼', '此', '耳', '語', '兩', '根', '本', '；', '尤', ':', '還', '鮮', '綠', '敢', '許', '惡', '作', '劇', '可', '某', '募', '款', '動', '幾', '鐘', '入', '場', '腦', '海', '集']

# Find the indices of the characters in the character_data list
indices = []
for char in characters_to_find:
    for i, item in enumerate(character_data):
        if item['char'] == '\n' + char:
            indices.append(i)
            break

# Save the indices to a file
with open('character_indices.txt', 'w') as f:
    f.write('\n'.join(map(str, indices)))


# for i in indices:
for i in range(400, 1000):
    char = character_data[i]['char']
    definition = character_data[i]['definition']
    try:
        image_description = create_image_description(char, definition)
    except:
        print(f"Failed for character {char}")
        continue
    character_data[i]['image_description'] = image_description
    print(i)
    print(image_description)


with open('character_data.jsonl', 'w', encoding='utf-8') as f:
    for item in character_data:
        json.dump(item, f, ensure_ascii=False)
        f.write('\n')