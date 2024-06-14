import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import Groq from 'groq-sdk';
const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

export const POST: RequestHandler = async ({ request }) => {
    const { sentence, word } = await request.json();

    const systemPrompt = `You will be given a Chinese sentence and a word/character from that sentence. Provide a brief explanation of the given word/character in the context of the sentence. 
    Include the relevant part of the sentence in your response.
`;
  
    const chatCompletion = await groq.chat.completions.create({
      model: 'llama3-70b-8192',
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        {
          role: 'user',
          content: `Sentence: ${sentence}\nWord: ${word}`,
        },
      ],
      temperature: 0.0,
      max_tokens: 500,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });
  
    const content = chatCompletion.choices[0].message.content;
    if (!content) {
      throw new Error('No content in chatCompletion');
    }
    return json({ content }, { status: 201 });
};