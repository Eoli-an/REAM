import type { PageServerLoad } from './$types';
import {cut} from '@node-rs/jieba';
// Jieba only works on server, maybe later better to do everything on clientside for android app
import { translateWord } from './translate';
// import {tify, sify} from 'chinese-conv';
import pkg from 'chinese-conv';
const { tify, sify } = pkg;

export const load = (async ({fetch}) => {
    const response = await fetch('/harry_potter.txt');//SvelteKit automatically serves files from the static directory, so you can directly access the file using its relative path.
    const text = await response.text();
    const text_traditional = tify(text);
    const text_simplified = sify(text);
    const text_cut = cut(text_traditional);

    const wordsToTranslate = text_cut.slice(0, 10); // Example: translate first 10 words
    const translations = await translateWord(text_traditional, wordsToTranslate);

    const response2 = await fetch('/my_known_words.json');
    const knownWords = await response2.json();


    return {
        text: text,
        knownWords: knownWords,
        text_cut: text_cut,
        translations: translations
    };
}) satisfies PageServerLoad;

