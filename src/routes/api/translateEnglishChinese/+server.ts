import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import Groq from 'groq-sdk';
const groq = new Groq({
	apiKey: process.env.GROQ_API_KEY
});

function splitIntoSentences(text: string): string[] {
	const sentences = [];
	const parts = text.split(/(\.|\!|\?)/g);

	for (let i = 0; i < parts.length; i += 2) {
		const sentence = parts[i] + (parts[i + 1] || '');
		sentences.push(sentence);
	}

	return sentences;
}

export const POST: RequestHandler = async ({ request }) => {
	const { text } = await request.json();

	const sentences = splitIntoSentences(text);

	const translatedSentences = [];
	for (let i = 0; i < sentences.length - 1; i += 10) {
		const batch = sentences.slice(i, i + 10);
		const { content } = await translate(batch);
		translatedSentences.push(content);
	}

	return json({ content: translatedSentences.join('') }, { status: 201 });
};

async function translate(sentences: string[]): Promise<{ content: string }> {
	const systemPrompt = `Translate the following English text to Chinese. Use traditional characters. Only output the translated text, nothing else. Keep the translation grammatically simple.
	Examples:
	USER:
	But as he reached the edge of town, his thoughts about drills were replaced by something else.
Stuck in the usual morning traffic jam, he couldn't help but notice that there were a lot of strangely dressed people around.
People were walking around wearing cloaks.Mr. Dursley hated people who wore strange clothes, like the weird outfits he saw on young people.

ASSISTANT:
但他走到鎮邊緣時，關於鑽頭的念頭被其他事情取代了。
困在平常的早高峰交通堵塞中，他不禁注意到周圍有很多穿著奇怪衣服的人。
人們穿著斗篷走來走去。達斯利先生討厭穿奇怪衣服的人，就像他看到年輕人穿的那些奇怪的服裝一樣。`;

	const chatCompletion = await groq.chat.completions.create({
		model: 'llama3-70b-8192',
		messages: [
			{
				role: 'system',
				content: systemPrompt
			},
			{
				role: 'user',
				content: sentences.join('\n')
			}
		],
		temperature: 0.0,
		max_tokens: 10000,
		top_p: 1,
		frequency_penalty: 0,
		presence_penalty: 0
	});

	const content = chatCompletion.choices[0].message.content;
	if (!content) {
		throw new Error('No content in chatCompletion');
	}
	return { content };
}
