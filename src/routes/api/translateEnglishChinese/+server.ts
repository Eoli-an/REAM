import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import { callLLM } from '../llmService';

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
	const systemPrompt = `Translate the following English text to Chinese. Only output the translated text, nothing else. Keep the translation grammatically simple.
	It should be suitable for a beginner/intermediate chinese learner. Make it feel like proper chinese, not just a translation. Make the translation natural.

	Examples:
	USER:
	But as he reached the edge of town, his thoughts about drills were replaced by something else.
Stuck in the usual morning traffic jam, he couldn't help but notice that there were a lot of strangely dressed people around.
People were walking around wearing cloaks.Mr. Dursley hated people who wore strange clothes, like the weird outfits he saw on young people.

ASSISTANT:
但是，當他到達城鎮邊緣時，他腦海中關於鑽頭的想法被其他東西取代了。
在平常的早晨交通堵塞中，他不禁注意到周圍有很多穿著奇怪的人。
人們穿著斗篷走來走去。德思禮先生討厭穿奇裝異服的人，就像他在年輕人身上看到的那種怪異的衣服一樣。

USER:
Harry put the plates of egg and bacon on the table, which was difficult
as there wasn't much room. Dudley, meanwhile, was counting his presents.
His face fell.

"Thirty-six," he said, looking up at his mother and father. "That's two
less than last year."

"Darling, you haven't counted Auntie Marge's present, see, it's here
under this big one from Mommy and Daddy."

ASSISTANT:
哈利把放著雞蛋和培根的盤子放到桌上，因為空間不大，所以有點困難。與此同時，達力正在數他的禮物。
他失望地說：「三十六個。」他抬頭看著他的父母說：「比去年少了兩個。」
「親愛的，你還沒算瑪姬阿姨的禮物，你看，在爸爸媽媽送你的這個大禮物下面。」

USER:
The very idea of a novel miracle weight-loss drug might provoke eye rolls because this is the kind of thing we’ve seen before. Often, it’s a drug like ephedra, which was all the rage in the ’90s and 2000s. Ephedra did help people lose weight, but it was eventually pulled from the shelves because of its links to heart attacks, strokes, and seizures.

ASSISTANT:
一種神奇的減肥藥，你可能聽了就想翻白眼，因為這種東西我們以前見多了。通常，這種藥就像麻黃，在 90 年代和 2000 年代非常流行。麻黃確實可以幫助人們減肥，但最終因為與心臟病、中風和癲癇發作有關而被下架。`;
	const content = await callLLM(systemPrompt, sentences.join('\n'), false);
	return { content };
}
