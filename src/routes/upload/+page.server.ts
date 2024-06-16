import type { Actions, PageServerLoad } from './$types';
import { supabase } from '$lib/supabaseClient';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';

export const load = (async () => {
	// const { data, error } = await supabase.from('distinct_text_id').select();

	// if (error) {
	// 	console.error('Error fetching book IDs:', error);
	// 	return { texts: [] };
	// }
	const { data, error } = await supabase.from('TextsMetadata').select();

    if (error) {
        console.error('Error fetching text metadata:', error);
        return { texts: [] };
    }

    return { texts: data };
}) satisfies PageServerLoad;

export const actions: Actions = {
	uploadTextChinese: async ({ request, fetch }) => {
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
		const title: string = formData.get('title') as string; 


		const response = await fetch('/api/process', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ text, text_id })
		});

		if (response.ok) {
			const {error } = await supabase
			.from('TextsMetadata')
			.upsert({ text_id: text_id, title: title}, { onConflict: 'text_id' });
			// TODO proper error handling
			if (error) {
				console.error('Error updating database:', error);
			}
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
		const title: string = formData.get('title') as string; 

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

		const { content: translatedText } = await translateResponse.json();

		console.log(translatedText);
		const staticDir = 'static';
		const filePath = path.join(process.cwd(), staticDir, 'translated_text.txt');
		fs.writeFileSync(filePath, translatedText);

		// Call the processEnglish API with the translated text
		const processResponse = await fetch('/api/process', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ text: translatedText, text_id })
		});

		if (processResponse.ok) {
			const {error } = await supabase
			.from('TextsMetadata')
			.upsert({ text_id: text_id, title: title}, { onConflict: 'text_id' });
			// TODO proper error handling
			if (error) {
				console.error('Error updating database:', error);
			}
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
