import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import Groq from 'groq-sdk';
const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});


export const POST: RequestHandler = async ({ request }) => {
    const { text, words } = await request.json();
    const { filteredWords, positions } = filterWordsAndRecordPositions(words);


    const chatInput = text + '\n\n-' + filteredWords.join('\n-');
    const systemPrompt = `You will be given a piece of chinese text and then a list of words from this chinese text. Generate word-by-word translations, that are context appropriate. Be brief with the translations.
    Do NOT output anything else. Adhere strcitly to the format of the example output. Start directly with the first word, no introduction or explanation. If words repeat, also repeat the translation.
  
  Like this:
  User:
  哈利波特站在火車站的月台上，心情既興奮又緊張。他即將乘坐霍格華茲特快列車，前往他夢寐以求的魔法學校。
  
  -月台
  -即將
  -前往
  
   Assitant:
  -月台: platform
  -即將: soon 
  -前往: go`;
  
    const chatCompletion = await groq.chat.completions.create({
      model: 'llama2-70b-4096',
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        {
          role: 'user',
          content: chatInput,
        },
      ],
      temperature: 1,
      max_tokens: 10000,//chatInput.length * 5,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      //stream: true,
    });
  
    const content = chatCompletion.choices[0].message.content;
    if (!content) {
      throw new Error('No content in chatCompletion');
    }
    console.log("CONTENT: ", chatInput);
    console.log("RESPONSE: ", content);

  
    const outputList: (string)[] = [];
    const lines = content.split('\n');
    console.log("LINES: ", lines);
    let outputIndex = 0;

    // Reinsert special characters into their original positions
    for (const line of lines) {
        if (!line.includes(': ')) {
            continue;
        }
        while (positions.length > 0 && positions[0].index === outputIndex) {
            outputList.push(positions.shift()?.character ?? '');
            outputIndex++;
        }
        const translation = line.split(': ')[1].split('/')[0].split('(')[0].replace("'", "").trim();
        outputList.push(translation);
        outputIndex++;
    }

    // Append any remaining special characters
    while (positions.length > 0) {
        outputList.push(positions.shift()?.character ?? '');
    }
    console.log("OUTPUT: ", outputList);
    return json({ outputList }, { status: 201 });
};


function filterWordsAndRecordPositions(words: string[]) {
    const specialCharacters = new Set([' ', '"', '\uFF0C', '"', '。', '？', '！', '\r\n', '\n', '\r', '：', '；', '、', '（', '）', '《', '》', '『', '』', '【', '】', '—', '…', '～', '·', '「', '」', '＂', '＇']);
    const filteredWords: string[] = [];
    const positions: { index: number; character: string }[] = [];

    words.forEach((word, index) => {
        if (specialCharacters.has(word)) {
            positions.push({ index, character: word });
        } else {
            filteredWords.push(word);
        }
    });

    return { filteredWords, positions };
}