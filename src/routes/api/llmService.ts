import Groq from 'groq-sdk';
import OpenAI from 'openai';

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
  },
})

export async function callLLM(system_prompt: string, user_prompt: string, useGroq: boolean): Promise<string> {
    let chatCompletion;
    if (useGroq) {
        chatCompletion = await groq.chat.completions.create({
          model: 'llama3-70b-8192',
          messages: [
            {
              role: 'system',
              content: system_prompt,
            },
            {
              role: 'user',
              content: user_prompt,
            },
          ],
          temperature: 0,
          max_tokens: 10000,
          top_p: 1,
          frequency_penalty: 0,
          presence_penalty: 0,
        });
    } else {
        chatCompletion = await openai.chat.completions.create({
            model: 'google/gemini-flash-1.5',
            messages: [
                {
                    role: 'system',
                    content: system_prompt,
                },
                {
                    role: 'user',
                    content: user_prompt,
                },
            ],
            temperature: 0,
            max_tokens: 10000,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
        });
    }

    const content = chatCompletion.choices[0].message.content;
    if (!content) {
      throw new Error('No content in chatCompletion');
    }

    return content;
}