import type { RequestHandler } from './$types';
import { callLLM } from '../../llmService';
import { json } from '@sveltejs/kit';
import { cut } from '@node-rs/jieba';

export const POST: RequestHandler = async ({ request }) => {
    const { sentence } = await request.json();

    const { words, translations } = await splitAndTranslate(sentence);

    return json({ words, translations }, { status: 200 });
};

async function splitAndTranslate(text: string): Promise<{ words: string[]; translations: string[] }> {
    // Use jieba to cut the text into words
    const jiebaWords = cut(text);
    console.log(text);
    console.log(jiebaWords);

    // Prepare the prompt
    const systemPrompt = `You will be given a list of Chinese words segmented by jieba. For each word, generate a context-appropriate translation. Note that jieba does not recognize named entities, so you may need to combine multiple words into one for named entities.
    For everything else, stick with the given segmentation. Be sure to follow this, named entities are very important, combine them!
    Some examples:
    USER:
    王 -
    美 -
    丽 -
    ASSISTANT:
    王美丽 - Wang Meili

    USER:
    陈 -
    飞 -

    ASSISTANT:
    陈飞 - Chen Fei

    USER:
    麦 -
    当 -
    劳 -

    ASSISTANT:
    麦当劳 - McDonald's

    USER:
    安 -
    吉 -
    丽 -
    娜 -

    ASSISTANT:
    安吉丽娜 - Angelina

    Ok so always rember to combine named entities! now for the translations:
Be brief with the translations. If you encounter punctuation, just copy them. It is important to follow my instructions because I will parse the output programmatically afterwards.

Adhere strictly to the format of the example output. Generate a short translation for every word, even if it is a grammar particle. Start directly with the first word, no introduction or explanation. Do not include empty lines, every line should contain a dash (-).

Examples:

USER:
Text:
哈利波特站在火車站的月台上，心情既興奮又緊張。他即將乘坐霍格華茲特快列車，前往他夢寐以求的魔法學校。
Jieba split:
哈 -
利 -
波 -
特 -
站 -
在 -
火車 -
站 -
的 -
月台 -
上 -
，-
心情 -
既 -
興奮 -
又 -
緊張 -
。-
ASSISTANT:
哈利 - Harry
波特 - Potter
站 - stands
在 - at
火車站 - train station
的 - 's
月台 - platform
上 - on
，- ，
心情 - mood
既 - both
興奮 - excited
又 - and
緊張 - nervous
。- 。

USER:
Text:
小明：老板，买单。

经理：好的，您一共消费了300元。
Jieba split:
小 -
明 -
：- 
老板 -
，-
买单 -
。-
经理 -
：-
好的 -
，-
您 -
一共 -
消费 -
了 -
300 -
元 -
。-

ASSISTANT:
小明 - Xiao Ming
：- :
老板 - boss
，- ，
买单 - give bill
。- 。
经理 - manager
：- :
好的 - ok
，- ，
您 - you
一共 - total
消费 - spend
了 - past action
300 - 300
元 - yuan
。- 。
`;

    const chatInput = `Text:\n${text}\nJieba cut:\n${jiebaWords.map(word => word + ' -').join('\n')}`;
    console.log(chatInput);
    const content = await callLLM(systemPrompt, chatInput, false);

    const words: string[] = [];
    const translations: string[] = [];
    const lines = content.split('\n');

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

    return { words, translations };
}
