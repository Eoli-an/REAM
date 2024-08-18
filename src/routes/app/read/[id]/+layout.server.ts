import type { LayoutServerLoad } from './$types';
import { cut } from '@node-rs/jieba';
// Jieba only works on server, maybe later better to do everything on clientside for android app
import { translateWord } from './translate';
// @ts-ignore
import pkg from 'chinese-s2t';
const { s2t, t2s } = pkg;

import { pinyin } from 'pinyin-pro';

export const load = (async ({ fetch, params, locals: { supabase } }) => {
	const text_less_complex = false;
	let response;
	if (!text_less_complex) {
		response = await fetch('/short_story.txt'); //SvelteKit automatically serves files from the static directory, so you can directly access the file using its relative path.
	} else {
		response = await fetch('/harry_potter_less_complex.txt');
	}
	const text = await response.text();
	const text_traditional = s2t(text);
	const text_simplified = t2s(text);
	// const text_cut = cut(text_traditional);
	// const pinyin_cut = text_cut.map((c_word) => pinyin(c_word));

	let sentenceOffsets: number[] = [];
	

	const offset = 0;
	const words_per_page = 40;

	const { data: wordKnowledgeData } = await supabase.from('MyKnownWords').select();
	const { data: sentenceIndexData } = await supabase.from('TextsMetadata').select("currentSentence").eq('text_id', params.id).single();
	// const { data: sentenceIndexData } = await supabase.from('SentenceIndex').select().eq('id', 12345);
	const { data: characterKnowledgeData } = await supabase.from('MyKnownCharacters').select();

	const currentId = params.id;

	return {
		text: text,
		wordKnowledgeData: wordKnowledgeData,
		characterKnowledgeData: characterKnowledgeData,
		// text_cut: text_cut,
		//translations: translations,
		// pinyin_cut: pinyin_cut,
		offset: offset,
		words_per_page: words_per_page,
		sentenceOffsets: sentenceOffsets,
		currentSentenceIndex: sentenceIndexData?.currentSentence || 0,
		// imagePaths: imagePaths,
		currentId: currentId,
	};
}) satisfies LayoutServerLoad;
