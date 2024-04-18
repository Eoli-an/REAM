import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import Groq from 'groq-sdk';
const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

export const POST: RequestHandler = async ({ request }) => {
    const { text } = await request.json();

    const systemPrompt = `Simplify the chinese text. Only output the simplified text, nothing else. Stick close to the meaning, but use as many
    HSK1-3 words as possible.`;
  
    const chatCompletion = await groq.chat.completions.create({
      model: 'llama2-70b-4096',
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        {
          role: 'user',
          content: text,
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
    return json({ content }, { status: 201 });
};