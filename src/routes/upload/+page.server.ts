import type { Actions, PageServerLoad } from './$types';
import { supabase } from '$lib/supabaseClient';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';
// @ts-ignore
import pkg from 'chinese-s2t';
const { s2t, t2s } = pkg;

export const load = (async () => {
	const { data, error } = await supabase.from('TextsMetadata').select();

    if (error) {
        console.error('Error fetching text metadata:', error);
        return { texts: [] };
    }

    return { texts: data };
}) satisfies PageServerLoad;

export const actions: Actions = {
uploadTextChinese: async ({ request, fetch}) => {
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

		const sentences = splitIntoSentences(text);

		// Upload first sentence and wait for it
		await processAndUploadOneSentence(sentences[0], text_id, 0, fetch);

		// Upload the rest of the sentences asynchronously
		processAndUpload(sentences, text_id, fetch);


		return {
				success: true,
				message: 'Text processed successfully.'
			};


	},

	uploadTextEnglish: async ({ request, fetch }) => {
		const formData = await request.formData();
		const file = formData.get('file') as File;
		const text_id: string = uuidv4(); // Generate a new UUID

		if (!file) {
			return {
				success: false,
				message: 'Please upload a .txt file.'
			};
		}

		const text = await file.text();
		let title: string = formData.get('title') as string;
		title = title.split('.')[0];


		// Call the simplifyEnglish API first
		const simplifyResponse = await fetch('/api/simplifyEnglish', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ text })
		});

		if (!simplifyResponse.ok) {
			return {
				success: false,
				message: 'Error simplifying text.'
			};
		}

		const { content: simplifiedText } = await simplifyResponse.json();

		const translateResponse = await fetch('/api/translateEnglishChinese', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ text: simplifiedText })
		});

		if (!translateResponse.ok) {
			return {
				success: false,
				message: 'Error translating text.'
			};
		}

		let { content: translatedText } = await translateResponse.json();

		console.log(translatedText);
		const staticDir = 'static';
		const filePath = path.join(process.cwd(), staticDir, 'translated_text.txt');
		fs.writeFileSync(filePath, translatedText);

		translatedText = s2t(translatedText);

		const {error } = await supabase
			.from('TextsMetadata')
			.upsert({ text_id: text_id, title: title}, { onConflict: 'text_id' });
			// TODO proper error handling
			if (error) {
				console.error('Error updating database:', error);
			}

		// Call the processEnglish API with the translated text
		const processResponse = await fetch('/api/process', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ text: translatedText, text_id })
		});

		if (processResponse.ok) {
			
			return {
				success: true,
				message: 'Text processed successfully.'
			};
		} else {
			return {
				success: false,
				message: 'Error processing text.'
			};
		}
	}
};



function splitIntoSentences(text: string): string[] {
	const sentences = [];
	const parts = text.split(/[。！？]/g);

	for (let i = 0; i < parts.length; i += 2) {
		const sentence = parts[i] + (parts[i + 1] || '');
		sentences.push(sentence);
	}

	return sentences;
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

async function processAndUpload(sentences: string[], text_id: string, fetch: any) {
			for (let i = 1; i < sentences.length - 1; i += 1) {
			const sentence = sentences[i];
			processAndUploadOneSentence(sentence, text_id, i, fetch);
		}
}

async function processAndUploadOneSentence(sentence: string, text_id: string, sentence_id: number, fetch: any) {
	const { simplifiedSentence } = await callApi('/api/newDataScheme/simplifySentence', { sentence }, fetch);

	const [
		{ sentenceTranslation : translatedSentence },
		{ sentenceTranslation : translatedSimplifiedSentence},
		{ words, translations },
		{ words : simplifiedWords, translations : simplifiedTranslations }
    ] = await Promise.all([
        callApi('/api/translate_sentence', { sentence : sentence}, fetch),
        callApi('/api/translate_sentence', { sentence : simplifiedSentence }, fetch),
        callApi('/api/newDataScheme/splitWordsAndTranslate', { sentence : sentence}, fetch),
        callApi('/api/newDataScheme/splitWordsAndTranslate', { sentence : simplifiedSentence }, fetch)
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