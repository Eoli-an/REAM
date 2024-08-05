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

	const simplifiedSentences = [];
	for (let i = 0; i < sentences.length - 1; i += 10) {
		const batch = sentences.slice(i, i + 10);
		const { content } = await simplify(batch);
		simplifiedSentences.push(content);
	}

	return json({ content: simplifiedSentences.join('') }, { status: 201 });
};

async function simplify(sentences: string[]): Promise<{ content: string }> {
	const systemPrompt = `Simplify the English text. Only output the simplified text, nothing else. Stick close to the meaning and style, but use as many common words as possible. Use simple grammar patterns. Do not simplify the content, like scientific facts, only simplify the language and grammar. Keep the simplified text at a similar length as the original text, at times even increasing the length for better clarity. Still, keep the text interesting.

Some examples:
USER:
Considered by many the greatest wizard of modern times, Dumbledore is
particularly famous for his defeat of the dark wizard Grindelwald in
1945, for the discovery of the twelve uses of dragon's blood, and his
work on alchemy with his partner, Nicolas Flamel. Professor Dumbledore
enjoys chamber music and tenpin bowling.
Harry turned the card back over and saw, to his astonishment, that
Dumbledore's face had disappeared.
"He's gone!"
"Well, you can't expect him to hang around all day," said Ron. "He'll be
back. No, I've got Morgana again and I've got about six of her... do you
want it? You can start collecting."

ASSISTANT:
Many people believe Dumbledore is the best wizard of our time. He is well-known for defeating the evil wizard Grindelwald in 1945. He is also famous for discovering twelve ways to use dragon's blood. And people know him for his work with his partner, Nicolas Flamel, on alchemy. Professor Dumbledore likes to listen to chamber music and play tenpin bowling.
Harry flipped the card over. He was surprised to see that Dumbledore's face was gone!
"He vanished!" Harry exclaimed.
"Well, you can't expect him to stay there all day," said Ron. "He'll come back. Anyway, I got Morgana again. And I have about six of her... Do you want one? You can start your collection."

USER:
Moore’s law is already pretty fast. It holds that computer chips pack in twice as many transistors every two years or so, producing major jumps in speed and efficiency. But the computing demands of the deep learning era are growing even faster than that — at a pace that is likely not sustainable. The International Energy Agency predicts that artificial intelligence will consume 10 times as much power in 2026 as it did in 2023, and that data centers in that year will use as much energy as Japan. “The amount of [computing power] that AI needs doubles every three months,” said Nick Harris, founder and CEO of the computing-hardware company Lightmatter — far faster than Moore’s law predicts. “It’s going to break companies and economies.”

ASSISTANT:
Moore’s law is already pretty fast. It states that computers double their amount of transistors every two years. This means computers get much faster and better at using energy. But, the artificial intelligence we are creating needs even more power than that, and it's growing likely too fast for us to keep up. The International Energy Agency believes that by 2026, AI will use 10 times more power than it did in 2023 and think data centers will use as much energy as all of Japan in that year.  “The amount of [computing power] that AI needs doubles every three months,” said Nick Harris, founder and CEO of the computing-hardware company Lightmatter — far faster than Moore’s law predicts. “It’s going to break companies and economies.”

USER:
Naturally, he had thought that the long campaign and the strain of the election had caused him to go mad. He had been utterly terrified to find a portrait talking to him, though this had been nothing to how he had felt when a self-proclaimed wizard had bounced out of the fireplace and shaken his hand. He had remained speechless throughout Fudge's kindly explanation that there were witches and wizards still living in secret all over the world, and his reassurances that he was not to bother his head about them as the Ministry of Magic took responsibility for the whole wizarding community and prevented the non-magical population from getting wind of them. It was, said Fudge, a difficult job that encompassed everything from regulations on the responsible use of broomsticks to keeping the dragon population under control (the Prime Minister remembered clutching the desk for support at this point). Fudge had then patted the shoulder of the still-dumbstruck Prime Minister in a fatherly sort of way.

ASSISTANT:
He thought the long election and all the stress had made him crazy. First, a talking portrait scared him silly. But that was nothing compared to the fright he got when a man claiming to be a wizard jumped out of the fireplace and shook his hand. This man, Fudge, explained in a kind voice that there were still witches and wizards living secretly among us. He assured the man that he didn't need to worry about them at all. The Ministry of Magic was in charge of all magical folk and made sure regular people never found out about them. It was a tough job, Fudge explained, involving everything from making sure broomsticks were used safely to keeping the dragon population under control. (The man remembered grabbing his desk for support when he heard about the dragons). Then, Fudge patted the shocked man on the shoulder, like a father comforting his son.`;

	const content = await callLLM(systemPrompt, sentences.join('\n'), true);
	return { content };
}
