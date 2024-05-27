import type { PageServerLoad } from './$types';
import {cut} from '@node-rs/jieba';
// Jieba only works on server, maybe later better to do everything on clientside for android app
import { translateWord } from './translate';
// @ts-ignore
import pkg from 'chinese-s2t';
const {s2t, t2s} = pkg;

import { pinyin } from "pinyin-pro";
import { supabase } from "$lib/supabaseClient";

import { wordKnowledge } from '$lib/stores';



export const load = (async ({fetch}) => {
    const text_less_complex = false;
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

    let sentenceOffsets: number[] = [];
    let currentSentenceIndex = 0;

    function calculateSentenceOffsets() {
        let offset = 0;
        while (offset < text_cut.length) {
            sentenceOffsets.push(offset);
            while (offset < text_cut.length && !['。', '！', '？'].includes(text_cut[offset])) {
                offset++;
            }
            offset++; // Move past the punctuation mark
        }
    }
    calculateSentenceOffsets();


    //const wordsToTranslate = text_cut.slice(0, 10); // Example: translate first 10 words
    //const translations = await translateWord(text_traditional, wordsToTranslate);

    const response2 = await fetch('/my_known_words.json');
    const knownWords = await response2.json();

    const response3 = await fetch('/images.json');
    const imagePaths = await response3.json();

    const offset = 0;
    const words_per_page = 40;

    // const { data: wordKnowledgeData, error } = await supabase.from("MyKnownWords").select();
    // if (error) {
    //     console.error("Error fetching data from Supabase:", error);
    //     throw new Error("Failed to fetch data from Supabase");
    // }

    // console.log("Fetched data from Supabase:", wordKnowledgeData);

    // const wordKnowledgeDict: { [key: string]: number | null } = {};
    // wordKnowledgeData?.forEach(item => {
    //     if (item.wordChinese && item.knowledgeLevel !== undefined) {
    //         wordKnowledgeDict[item.wordChinese] = item.knowledgeLevel;
    //     } else {
    //         console.warn("Invalid data item:", item);
    //     }
    // });

    // wordKnowledge.set(wordKnowledgeDict);

    const { data : wordKnowledgeData} = await supabase.from("MyKnownWords").select();
    //console.log("wordKnowledgeData", wordKnowledgeData);
    //const wordKnowledgeDict: { [key: string]: number | null } = {};
    // wordKnowledgeData?.forEach(item => {
    //     wordKnowledgeDict[item.wordChinese] = item.knowledgeLevel;
    //     wordKnowledge.update(knowledge => {
    //         knowledge[item.wordChinese] = item.knowledgeLevel;
    //         return knowledge;
    //     });
    // });

    //wordKnowledge.set(wordKnowledgeDict);
    console.log("wordKnowledge inside load", wordKnowledge);

    return {
        text: text,
        wordKnowledgeData: wordKnowledgeData,
        text_cut: text_cut,
        //translations: translations,
        pinyin_cut: pinyin_cut,
        offset: offset,
        words_per_page: words_per_page,
        sentenceOffsets: sentenceOffsets,
        currentSentenceIndex: currentSentenceIndex,
        imagePaths: imagePaths,

    };
}) satisfies PageServerLoad;

