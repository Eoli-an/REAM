import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import { callLLM } from '../../llmService';

export const POST: RequestHandler = async ({ request }) => {
	const { sentence } = await request.json();

	const { simplifiedSentence } = await simplify(sentence);

	return json({ simplifiedSentence: simplifiedSentence }, { status: 200 });
};

async function simplify(sentence: string): Promise<{ simplifiedSentence: string }> {
	const systemPrompt = `You will be given a Chinese text. Simplify this text. Simplification includes
- using less complex grammar
- using more frequent characters and words
- splitting up long sentences

Make sure to really follow those instructions. The text will be given to beginning Chinese learners, so it can not be too complex.

If the original text used traditional characters, also use traditional characters in the output. If the original text used simplified characters, use simplified characters in the output.

Carefully examine the following examples and make sure to follow the same style. The output should be very simplified, but still interesting and engaging.

Examples:
USER:
家住女貞路4號的德思禮夫婦總是得意地說他們是非常規矩的人家，拜託 ，拜託了。他們從來跟神秘古怪的事不沾邊，因為他們根本不相信那些邪門歪道。

ASSISTANT:
德思禮夫婦住在女貞路4號。他們常說自己是很正常的人。他們不喜歡奇怪的事。他們不相信不正常的事

USER:
“沒有，”她厲聲說，“怎麼了？”
「今天的新聞有點奇怪，」德思禮先生咕噥說，「成群的貓頭鷹……流星 雨……今天城裡又有那麼多怪模怪樣的人……”
「那又怎麼樣?」德思禮太太急赤白臉地說。

ASSISTANT:
"沒有，"她生氣地說，"怎麼了？"
「今天的新聞很奇怪，」德思禮先生小聲說，"很多貓頭鷹…很多流星…城裡有很多奇怪的人…"
「那又怎麼樣？」德思禮太太不高興地說。

USER:
麥教授接著往下說，她的聲音顫抖了。 「還不只這些。他們說，他還想殺波特夫婦的兒子哈利，可是沒有成功。他殺不死那個孩子。

ASSISTANT:
麥教授繼續說。她的聲音在抖。"還有更多事。"「人們說，他想殺波特夫婦的兒子哈利。""但是他失敗了。""他殺不了那個小孩。"`;


	const simplifiedSentence = await callLLM(systemPrompt, sentence, false);
	return { simplifiedSentence };
}
