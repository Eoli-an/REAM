import { supabase } from '$lib/supabaseClient';

export async function updateDatabase(wordChinese: string, knowledgeLevel: number) {
    const { error } = await supabase
        .from('MyKnownWords') // Adjust the table name as needed
        .upsert({ wordChinese, knowledgeLevel }, { onConflict: 'wordChinese' });

    if (error) {
        console.error('Error updating database:', error);
    }
}

export async function updateDatabaseSentenceIndex(sentenceIndex: number, text_id: string) {
    const { error } = await supabase
        .from('TextsMetadata')
        .update({ currentSentence: sentenceIndex })
        .eq('text_id', text_id);

    if (error) {
        console.error('Error updating sentence database:', error);
    }
}

export async function uploadDatabaseBook(dicts: { word_position: number; word: string; translation: string; sentence: number; }[]
    , text_id: number
) {
    console.log(text_id)
    const data = dicts.map(dict => ({
        text_id: text_id,
        word_position: dict.word_position,
        word: dict.word,
        translation: dict.translation,
        sentence: dict.sentence
    }));

    const { error } = await supabase
        .from('Texts') 
        .upsert(data, { onConflict: 'text_id, word_position, sentence' });

    if (error) {
        console.error('Error uploading to database:', error);
    } else {
        console.log('Database upload successful');
    }
}