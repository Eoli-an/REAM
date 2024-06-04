import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import { uploadDatabaseBook } from '$lib';
import Groq from 'groq-sdk';
const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

// Function to split text into sentences
function splitIntoSentences(text: string): string[] {
    const sentences = [];
    const parts = text.split(/(。|！|？)/g);
    
    for (let i = 0; i < parts.length; i += 2) {
        const sentence = parts[i] + (parts[i + 1] || '');
        sentences.push(sentence);
    }
    
    return sentences;
}

// // Function to process a batch of sentences
// function processBatch(sentences: string[]): string {
//     // Split each sentence into words
//     const text = sentences.join('');
// }

export const POST: RequestHandler = async ({ request }) => {
    const { text } = await request.json();

    // Split text into sentences
    const sentences = splitIntoSentences(text);

    // Process sentences in batches of 5
    for (let i = 0; i < sentences.length; i += 1) {
        const batch = sentences.slice(i, i + 1);
        const outputDict = await splitAndTranslate(sentences.join(''), i);
        uploadDatabaseBook(outputDict);
    }

    // Return a success response
    return new Response('Processing completed', { status: 200 });
};


async function splitAndTranslate(text: string, sentence_id: number): Promise<{ word_position: number; word: string; translation: string; sentence:number;}[]> {


    const chatInput = text;
    const systemPrompt = `You will be given a chinese text. Split this text into words and generate word-by-word translations, that are context appropriate.
    Be brief with the translations. If you encouter punctations, just copy them. It is important to follow my instructions, because I will parse the output programmatically afterwards.
    Adhere strictly to the format of the example output. Generate a short translation for every word, even if it is a grammer part. Start directly with the first word, no introduction or explanation.
Example:
USER:
哈利波特站在火車站的月台上，心情既興奮又緊張。他即將乘坐霍格華茲特快列車，前往他夢寐以求的魔法學校。
ASSISTANT:
哈利波特 - Harry Potter
站 - stands
在 - at
火車站 - train station
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
霍格華茲特快列車 - Hogwarts Express
，- ,
前往 - go to
他 - his
夢寐以求 - dreamt of
的 - 's
魔法學校 - magic school
。- .`;
  
    const chatCompletion = await groq.chat.completions.create({
      model: 'llama3-70b-8192',
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
      temperature: 0,
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

  
    const outputDict: { word_position: number, word: string, translation: string, sentence:number}[] = [];
    const lines = content.split('\n');
    console.log("LINES: ", lines);

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const line_split = line.split('-');
        const word = line_split[0].trim();
        const translation = line_split[1].trim();

        outputDict.push({ word_position: i, word: word, translation: translation, sentence: sentence_id });
    }
    console.log("OUTPUT: ", outputDict);
    return outputDict;
};