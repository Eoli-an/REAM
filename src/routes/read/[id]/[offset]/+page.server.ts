import type { PageServerLoad } from './$types';
import { supabase } from "$lib/supabaseClient";

export const load = (async ({ parent, params, fetch}) => {
    
    const { text_cut, sentenceOffsets } = await parent();

    // const { data : sentenceIndexData} = await supabase.from("SentenceIndex").select().eq('id', 12345);

    const currentSentenceIndex = Number(params.offset);
    const page_words = text_cut.slice(sentenceOffsets[currentSentenceIndex], sentenceOffsets[currentSentenceIndex + 1] || text_cut.length);
    // const page_pinyin = pinyin_cut.slice(sentenceOffsets[currentSentenceIndex], sentenceOffsets[currentSentenceIndex + 1] || text_cut.length);

    const wordTranslations = loadWordTranslations(page_words, fetch);
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