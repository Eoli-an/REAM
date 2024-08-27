import type { RequestHandler } from './$types';
import { callLLM } from '../../llmService';
import { json } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
    const { sentence } = await request.json();

    const { words, translations } = await splitAndTranslate(sentence);

    return json({ words, translations }, { status: 200 });
};

async function splitAndTranslate(text: string): Promise<{ words: string[]; translations: string[] }> {
    const chatInput = text;
    const systemPrompt = `You will be given a chinese text. Split this text into words and generate word-by-word translations, that are context appropriate. Make sure each word is in the dictionary. Do not combine multiple words into one translation. Use traditional characters.
    Be brief with the translations. If you encouter punctations, just copy them. It is important to follow my instructions, because I will parse the output programmatically afterwards.
    Adhere strictly to the format of the example output. Generate a short translation for every word, even if it is a grammer part. Start directly with the first word, no introduction or explanation. Do not include empty lines, every line should contain a dash (-).
Example:
USER:
哈利波特站在火車站的月台上，心情既興奮又緊張。他即將乘坐霍格華茲特快列車，前往他夢寐以求的魔法學校。
ASSISTANT:
哈利 - Harry
波特 - Potter
站 - stands
在 - at
火車 - train
站 - station
的 - 's
月台 - platform
上 - on
，- ,
心情 - mood
既 - both
興奮 - excited
又 - and
緊張 - nervous
。- .
他 - He
即將 - about to
乘坐 - board
霍格華茲 - Hogwarts
特快 - express
列車 - train
，- ,
前往 - go to
他 - his
夢寐以求 - dreamt of
的 - 's
魔法 - magic
學校 - school
。- .
USER:
小明：老板，买单。

经理：好的，您一共消费了300元。

ASSISTANT:
小明 - Xiao Ming
：- :
老板 - boss
，- ,
买单 - give bill
。- .
经理 - manager
：- :
好的 - ok
，- ,
您 - you
一共 - total
消费 - spend
了 - past action
300 - 300
元 - yuan
。- .
USER:
我媽媽做的水果沙拉酸酸甜甜的,口感真不錯。

ASSISTANT:
我 - I
媽媽 - mom
做 - make
的 - 's
水果 - fruit
沙拉 - salad
酸酸 - sour
甜甜 - sweet
的 - 's
, - ,
口感 - taste
真 - really
不 - not
錯 - bad
。- .
USER:
但是當他回頭看時,只有一隻虎斑貓站在普里維特街的街角,沒有地圖在望。

ASSISTANT:
但是 - but
當 - when
他 - he
回頭 - turn around
看 - look
時 - time
, - ,
只有 - only
一 - one
隻 - measure word for animals
虎斑 - tabby
貓 - cat
站 - stand
在 - at
普里維特 - Privet
街 - street
的 - 's
街角 - corner
, - ,
沒有 - no
地圖 - map
在 - at
望 - sight
USER:
国王听了哈哈大笑地说：“怎么可能呢？这里可是首都啊，老虎不敢来。”

ASSISTANT:
国王 - king
听 - hear
了 - past action
哈哈 - haha
大笑 - laugh
地 - adverbial particle
说 - say
：- :
“ - "
怎么 - how
可能 - possible
呢 - question particle
？ - ?
这里 - here
可是 - but
首都 - capital
啊 - ah
，- ,
老虎 - tiger
不 - not
敢 - dare
来 - come`;
    const content = await callLLM(systemPrompt, chatInput, false);

    const words: string[] = [];
    const translations: string[] = [];
    const lines = content.split('\n');
    console.log("LINES: ", lines);

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (!line.includes('-')) continue;
        const line_split = line.split('-');
        try {
            const word = line_split[0].trim();
            const translation = line_split[1].trim();
            words.push(word);
            translations.push(translation);
        } catch (e) {
            console.log("Error: ", e);
            continue;
        }
    }
    console.log("OUTPUT: ", { words, translations });
    return { words, translations };
};