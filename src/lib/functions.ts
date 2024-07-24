import { supabase } from '$lib/supabaseClient';
// @ts-ignore
import pkg from 'chinese-s2t';
const { s2t, t2s } = pkg;

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

async function getImageIds(sentence: string, supabase: any) {
		const { data: imageData, error: imageError } = await supabase
			.from('images')
			.select('id, char, index')
			.in('char', [...new Set(sentence.split(''))]);

		if (imageError) {
			console.error('Error fetching image data:', imageError);
			return {};
		}

		const idDict: { [char: string]: { [index: number]: string } } = {};
		imageData.forEach((row: { char: string; index: number; id: string; }) => {
			if (!idDict[row.char]) {
				idDict[row.char] = {};
			}
			idDict[row.char][row.index] = row.id;
		});

		return idDict;
	}

async function getImageUrlsFromIds(idDict: { [char: string]: { [index: number]: string } }, supabase: any) {
		const urlDict: { [char: string]: { [index: number]: string } } = {};
		for (const char in idDict) {
			urlDict[char] = {}; 
			for (const index in idDict[char]) {
				const { data, error } = await supabase
					.storage
					.from('Images')
					.getPublicUrl(`images/${idDict[char][index]}`);

				if (error) {
					console.error('Error fetching public URL:', error);
				} else {
					urlDict[char][index] = data.publicUrl;
				}
			}
		}

		return urlDict;
	}

export async function getImageUrls(sentence: string, supabase: any) {
        // sentence can also be only one word

		const idDict = await getImageIds(s2t(sentence), supabase);
		const urlDict = await getImageUrlsFromIds(idDict, supabase);
		return urlDict;
	} 