import type { Actions, PageServerLoad } from './$types';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';
// @ts-ignore
import pkg from 'chinese-s2t';
const { s2t, t2s } = pkg;

export const load = (async ({ locals: { supabase } }) => {
	const { data, error } = await supabase.from('TextsMetadata').select();

    if (error) {
        console.error('Error fetching text metadata:', error);
        return { texts: [] };
    }

    return { texts: data };
}) satisfies PageServerLoad;

export const actions: Actions = {
uploadTextChinese: async ({ request, fetch, locals: { supabase }}) => {
		const formData = await request.formData();
		const file = formData.get('file') as File;
		const text_id: string = uuidv4(); // Generate a new UUID

		if (!file) {
			return {
				success: false,
				message: 'Please upload a .txt file.'
			};
		}

		let text = await file.text();

		const title: string = file.name.split('.')[0];

		const { data: userData, error: userError } = await supabase.auth.getUser();

		if (userError) {
			console.error('Error fetching user data:', userError);
			return {
				success: false,
				message: 'Error fetching user data.'
			};
		}

		const sentences = splitIntoSentences(text);

		const { error } = await supabase
			.from('TextsMetadata')
			.upsert({ text_id: text_id, title: title, user_id: userData.user?.id, sentenceAmount: sentences.length}, { onConflict: 'text_id' });
		// TODO proper error handling
		if (error) {
			console.error('Error updating database:', error);
		}

		
		// Upload first sentence and wait for it
		await processAndUploadOneSentence(sentences[0], text_id, 0, fetch, supabase);

		// Upload the rest of the sentences asynchronously
		processAndUpload(sentences, text_id, fetch, supabase);


		return {
				success: true,
				message: 'Text processed successfully.'
			};


	},

	uploadTextEnglish: async ({ request, fetch, locals: { supabase } }) => {

		const formData = await request.formData();
		const file = formData.get('file') as File;
		const text_id: string = uuidv4(); // Generate a new UUID

		if (!file) {
			return {
				success: false,
				message: 'Please upload a .txt file.'
			};
		}

		let text = await file.text();
		const title: string = file.name.split('.')[0];

		const { error } = await supabase
			.from('TextsMetadata')
			.upsert({ text_id: text_id, title: title }, { onConflict: 'text_id' });
		// TODO proper error handling
		if (error) {
			console.error('Error updating database:', error);
		}

		const translateResponse = await fetch('/app/api/translateEnglishChinese', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ text: text })
		});

		if (!translateResponse.ok) {
			return {
				success: false,
				message: 'Error translating text.'
			};
		}

		let { content: translatedText } = await translateResponse.json();

		

		const sentences = splitIntoSentences(translatedText);

		

		// Upload first sentence and wait for it
		await processAndUploadOneSentence(sentences[0], text_id, 0, fetch, supabase);

		// Upload the rest of the sentences asynchronously
		processAndUpload(sentences, text_id, fetch, supabase);


		return {
				success: true,
				message: 'Text processed successfully.'
			};
}		
};


function splitIntoSentences(text: string): string[] {
    // Regular expression to match sequences ending with Chinese punctuation or newline
    const regex = /[^。！？\n]+[。！？]?/g;
    const matches = text.match(regex);
    
    if (matches) {
        return matches
            .map(segment => segment.trim()) // Remove any leading/trailing whitespace
            .filter(segment => segment.length > 0); // Exclude empty strings
    }
    
    return [];
}

async function callApi(apiRoute: string, input: any, fetch:any) {
	const response = await fetch(apiRoute, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(input)
	});

    if (!response.ok) {
        const errorBody = await response.json();
        throw new Error(`Error during API call: ${errorBody.message || 'Unknown error'}`);
    }


	return await response.json();
}

async function processAndUpload(sentences: string[], text_id: string, fetch: any, supabase: any) {
    for (let i = 1; i < sentences.length; i += 1) {
        const sentence = sentences[i];
        await processAndUploadOneSentence(sentence, text_id, i, fetch, supabase);
        await new Promise(resolve => setTimeout(resolve, 10000)); // Wait for 10 seconds
    }
}

async function processAndUploadOneSentence(sentence: string, text_id: string, sentence_id: number, fetch: any, supabase: any) {
	console.log('Processing sentence:', sentence);
	const { simplifiedSentence } = await callApi('/app/api/newDataScheme/simplifySentence', { sentence }, fetch);

	const [
		{ sentenceTranslation : translatedSentence },
		{ sentenceTranslation : translatedSimplifiedSentence},
		{ words, translations },
		{ words : simplifiedWords, translations : simplifiedTranslations }
    ] = await Promise.all([
        callApi('/app/api/translate_sentence', { sentence : sentence}, fetch),
        callApi('/app/api/translate_sentence', { sentence : simplifiedSentence }, fetch),
        callApi('/app/api/newDataScheme/splitWordsAndTranslate2', { sentence : sentence}, fetch),
        callApi('/app/api/newDataScheme/splitWordsAndTranslate2', { sentence : simplifiedSentence }, fetch)
    ]);

	// TODO make this not await in case of async upload?
	const { error } = await supabase.from('Texts2').insert({
		text_id: text_id,
		sentence_id: sentence_id,

		sentence: words,
		sentence_translation: translatedSentence,
		sentence_word_translations: translations,

		simplified_sentence: simplifiedWords,
		sentence_simplified_translation: translatedSimplifiedSentence,
		sentence_simplified_word_translations: simplifiedTranslations,
	});

	if (error) {
		throw new Error(`Error uploading sentence to database: ${error.message}`);
	}
}