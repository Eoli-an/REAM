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

    // Prepare the prompt
    const systemPrompt = `You will be given a list of Chinese words segmented by jieba. For each word, generate a context-appropriate translation. Note that jieba does not recognize named entities, so you may need to combine multiple words into one for named entities. For everything else, stick with the given segmentation. 
    Think carefully about that.

Be brief with the translations. If you encounter punctuation, just copy them. It is important to follow my instructions because I will parse the output programmatically afterwards.

Adhere strictly to the format of the example output. Generate a short translation for every word, even if it is a grammar particle. Start directly with the first word, no introduction or explanation. Do not include empty lines, every line should contain a dash (-).

Example 1(notice how the the characters for harry potter should be combined):

USER:
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
`;

    const chatInput = jiebaWords.map(word => word + ' -').join('\n');

    // Now, call the LLM
    const content = await callLLM(systemPrompt, chatInput, true);

    // Now, parse the content
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
