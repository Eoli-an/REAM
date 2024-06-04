import type { PageServerLoad } from './$types';
import { supabase } from "$lib/supabaseClient";

export const load = (async ({ parent, params, fetch}) => {
    
    const dynamic = false;
    let page_words: string[] = [];
    let wordTranslations: Promise<string[]> = Promise.resolve([]);
    if (dynamic) {
        const { text_cut, sentenceOffsets } = await parent();

        const currentSentenceIndex = Number(params.offset);
        page_words = text_cut.slice(sentenceOffsets[currentSentenceIndex], sentenceOffsets[currentSentenceIndex + 1] || text_cut.length);

        wordTranslations = loadWordTranslations(page_words, fetch);
    } else {
        const { data: sentenceData, error } = await supabase
            .from("Texts")
            .select("word_position, word, translation")
            .eq("sentence", params.offset)
            .eq("text_id", 1234);
        if (error) {
            console.error('Error fetching sentence data:', error);
        }
        else {
            let translations: string[] = [];
            for (const row of sentenceData) {
                page_words.push(row.word ?? '');
                translations.push(row.translation ?? '');
            }
            // artifical promise to match the type
            wordTranslations = Promise.resolve(translations);   
        }
    }
    //TODO adjust
    const sentenceTranslation = loadSentenceTranslations(page_words, fetch);

    return {
        words: page_words,
        wordTranslations: wordTranslations,
        sentenceTranslation: sentenceTranslation,
    };
}) satisfies PageServerLoad;


async function loadWordTranslations(words: string[]	, fetch: any) {
    return fetch('/api/translate_words', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text: words.join(''), words })
    }).then((response: Response) => response.json()).then((data: { outputList: any[] }) => data.outputList);
}
async function loadSentenceTranslations(words: string[], fetch: any) {
    return fetch('/api/translate_sentence', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ sentence: words.join('')})
    }).then((response: Response) => response.json()).then((data: { sentenceTranslation: string }) => data.sentenceTranslation);
}