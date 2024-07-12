import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import Groq from 'groq-sdk';
const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});
import { callLLM } from '../llmService';

export const POST: RequestHandler = async ({ request }) => {
    const { sentence, word } = await request.json();

    const systemPrompt = `You will be given a Chinese sentence and a word/character from that sentence. Provide a brief explanation of the given word/character in the context of the sentence. 
    Include the relevant part of the sentence in your response. Now I will give you a few examples on how do do the task. Read them carefully and
    use them as a pattern. Adhere strictly to the format of the example output. If the word has multiple characters, also provide the meaning of the characters and how they combine to form the word.
    In contrast to the examples, please explicitly include newline characters in your response.
    Example:

    USER:
    Sentence: 達斯利先生自顧自哼著歌，選擇了最無聊的領帶穿上去上班。
    Word: 自顧自

    ASSISTANT:
    Relevant part of the sentence: 達斯利[Dursley] 先生[Mr.] 自顧自[himself] 哼著[hum] 歌[song] (Mr. Dursley hummed to himself)

    In this context, 自顧自 means "to oneself" or "by oneself".  It emphasizes that Mr. Dursley is humming the song without paying attention to anyone else.

    The word is made up of three characters, which have the following meaning in this context:
    自 - self/onself
    顧 - to look after
    自 - self/onself

    Thus the word 自顧自 can be interpreted as "looking after himself and only himself". The repetition of "自" at the beginning and end of the word emphasizes the self-absorbed nature.

    USER:
    Sentence: 達斯利先生自顧自哼著歌，選擇了最無聊的領帶穿上去上班。
    Word: 了

    ASSISTANT:
    Relevant part of the sentence: 選擇[choose] 了[completed action]\n

    In this context, 了 is a particle that indicates the completion of an action. So instead of choosing something, Mr. Dursley has already chosen something.\n

    USER:
    Sentence: 達斯利夫人高興地聊天，嘗試餵養他們尖叫的兒子達德利坐在高椅中\n
    Word: 尖叫\n

    ASSISTANT:
    Relevant part of the sentence: 餵養[feed] 他們[their] 尖叫[screaming] 的['s] 兒子[son] 達德利[Dudley]

    In this context, 尖叫 means "screaming". It describes the action of the son screaming loudly.

    The word is made up of two characters, which have the following meaning in this context:
    尖 - sharp/pointed
    叫 - to shout/to call out

    Thus the word 尖叫 can be interpreted as "sharply shouting", which is a vivid description of the son's loud screaming.

    
`;
    const content = await callLLM(systemPrompt, `Sentence: ${sentence}\nWord: ${word}`, true);
    console.log(content);
    return json({ content }, { status: 201 });
};