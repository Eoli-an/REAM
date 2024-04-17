import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import Groq from 'groq-sdk';
const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});
export const POST: RequestHandler = async ({ request }) => {
    const { text, words } = await request.json();
    const chatInput = text + '\n\n-' + words.join('\n-');
    const systemPrompt = `You will be given a piece of chinese text and then a list of words from this chinese text. Generate word-by-word translations, that are context appropriate. Be brief with the translations.
    Do NOT output anything else. Adhere strcitly to the format of the example output. Start directly with the first word, no introduction or explanation.
  
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

  
    const outputList: string[] = [];
    const lines = content.split('\n');
    console.log("LINES: ", lines);
    for (const line of lines) {
      if (!line.includes(': ')) {
        continue;
      }
      const translation = line.split(': ')[1].split('/')[0].split('(')[0].replace("'", "").trim();
      outputList.push(translation);
    }

    return json({ outputList }, { status: 201 });
};