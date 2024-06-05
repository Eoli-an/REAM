//     const text = `家住女貞路4號的德思禮夫婦總是得意地說他們是非常規矩的人家，拜託 ，拜託了。他們從來跟神祕古怪的事不沾邊，因爲他們根本不相信那些邪門歪道。
// 弗農·德思禮先生在一家名叫格朗寧的公司做主管，公司生產鑽機。他高大魁梧，胖得幾乎連脖子都沒有了，卻蓄着一臉大鬍子。德思禮太太是一個瘦削的金髮女人。`;

//     fetch('/api/process', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({ text: text })
//     })

// +page.server.ts
import type { Actions, PageServerLoad } from './$types';
import { supabase } from '$lib/supabaseClient';
import { v4 as uuidv4 } from 'uuid';

export const load = (async () => {
	const { data, error } = await supabase.from('distinct_text_id').select();

	if (error) {
		console.error('Error fetching book IDs:', error);
		return { texts: [] };
	}

	return { texts: data };
}) satisfies PageServerLoad;

export const actions: Actions = {
	uploadText: async ({ request, fetch }) => {
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

		const response = await fetch('/api/process', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ text, text_id })
		});

		if (response.ok) {
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
