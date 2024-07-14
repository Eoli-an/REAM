import type { PageServerLoad } from './$types';
import { supabase } from '$lib/supabaseClient';
import { url } from 'inspector';

export const load = (async ({ parent, params, fetch }) => {
	const dynamic = false;
	let page_words: string[] = [];
	let wordTranslations: Promise<string[]> = Promise.resolve([]);
	if (dynamic) {
		const { text_cut, sentenceOffsets } = await parent();

		const currentSentenceIndex = Number(params.offset);
		page_words = text_cut.slice(
			sentenceOffsets[currentSentenceIndex],
			sentenceOffsets[currentSentenceIndex + 1] || text_cut.length
		);

		wordTranslations = loadWordTranslations(page_words, fetch);
	} else {
		// If on-the-fly translation is not wished, fetch all the words and translations from the database
		const { data: sentenceData, error } = await supabase
			.from('Texts')
			.select('word_position, word, translation')
			.eq('sentence', params.offset)
			.eq('text_id', params.id);
		if (error) {
			console.error('Error fetching sentence data:', error);
		} else {
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

	const characterSet = new Set(page_words.join(''));

	const { data: imageChosenData, error } = await supabase
		.from('MyKnownCharacters')
		.select('character, chosen_image')
		.in('character', [...characterSet]);
		
	if (error) {
		console.error('Error fetching image data:', error);
	}
	
	const imageChosen:  { [key: string]: number }= {};
	imageChosenData?.forEach((row) => {
		imageChosen[row.character] = row.chosen_image;
	});

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

	async function getImageUrls(sentence: string, supabase: any) {
		const idDict = await getImageIds(sentence, supabase);
		const urlDict = await getImageUrlsFromIds(idDict, supabase);
		return urlDict;
	}
	const urlDict = await getImageUrls(page_words.join(''), supabase);




	updateCurrentSentence(page_words);

	return {
		words: page_words,
		wordTranslations: wordTranslations,
		sentenceTranslation: sentenceTranslation,
		imageChosen: imageChosen,
		imagePaths: urlDict,
	};
}) satisfies PageServerLoad;

async function loadWordTranslations(words: string[], fetch: any) {
	return fetch('/api/translate_words', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ text: words.join(''), words })
	})
		.then((response: Response) => response.json())
		.then((data: { outputList: any[] }) => data.outputList);
}
async function loadSentenceTranslations(words: string[], fetch: any) {
	return fetch('/api/translate_sentence', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ sentence: words.join('') })
	})
		.then((response: Response) => response.json())
		.then((data: { sentenceTranslation: string }) => data.sentenceTranslation);
}

async function updateCurrentSentence(page_words: string[]) {
  const currentSentence = page_words.join(' ');
  const { error } = await supabase
    .from('currentSentence')
    .update({ sentence: currentSentence})
    .eq('id', 0);

  if (error) {
    console.error('Error updating current sentence:', error);
  } 
//   else {
//     console.log('Current sentence updated successfully.');
//   }
}
