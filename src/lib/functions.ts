import { supabase } from '$lib/supabaseClient';

export async function updateDatabase(wordChinese: string, knowledgeLevel: number) {
    const { error } = await supabase
        .from('MyKnownWords') // Adjust the table name as needed
        .upsert({ wordChinese, knowledgeLevel }, { onConflict: 'wordChinese' });

    if (error) {
        console.error('Error updating database:', error);
    }
}