import type { PageServerLoad } from './$types';
import {cut} from '@node-rs/jieba';
// Jieba only works on server, maybe later better to do everything on clientside for android app
import { translateWord } from './translate';
// @ts-ignore
import pkg from 'chinese-s2t';
const {s2t, t2s} = pkg;

import { pinyin } from "pinyin-pro";


export const load = (async ({fetch}) => {
    const text_less_complex = true;
    let response;
    if (! text_less_complex) {
        response = await fetch('/harry_potter.txt');//SvelteKit automatically serves files from the static directory, so you can directly access the file using its relative path.
    } else {
        response = await fetch('/harry_potter_less_complex.txt');
    }
    const text = await response.text();
    const text_traditional = s2t(text);
    const text_simplified = t2s(text);
    const text_cut = cut(text_traditional);
    const pinyin_cut = text_cut.map(c_word => pinyin(c_word));


    //const wordsToTranslate = text_cut.slice(0, 10); // Example: translate first 10 words
    //const translations = await translateWord(text_traditional, wordsToTranslate);

    const response2 = await fetch('/my_known_words.json');
    const knownWords = await response2.json();

    const offset = 0;
    const words_per_page = 40;


    return {
        text: text,
        knownWords: knownWords,
        text_cut: text_cut,
        //translations: translations,
        pinyin_cut: pinyin_cut,
        offset: offset,
        words_per_page: words_per_page

    };
}) satisfies PageServerLoad;

