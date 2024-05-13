import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import Groq from 'groq-sdk';


const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

export const POST: RequestHandler = async ({ request }) => {
    const { sentence} = await request.json();

    const systemPrompt = `translate the following the sentence I give you into english. Only output the translation.`;

    const chatCompletion = await groq.chat.completions.create({
        model: 'llama3-70b-8192',
        messages: [
          {
            role: 'system',
            content: systemPrompt,
          },
          {
            role: 'user',
            content: sentence,
          },
        ],
        temperature: 0,
        max_tokens: 1000,//chatInput.length * 5,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
        //stream: true,
      });
    
    const sentenceTranslation = chatCompletion.choices[0].message.content;
      if (!sentenceTranslation) {
        throw new Error('No content in chatCompletion');
      }
      return json({ sentenceTranslation }, { status: 201 });
};