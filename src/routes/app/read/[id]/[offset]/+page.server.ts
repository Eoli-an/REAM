import type { PageServerLoad } from './$types';
import { getImageUrls } from '$lib/functions';
// @ts-ignore
import pkg from 'chinese-s2t';
const { s2t, t2s } = pkg;

export const load = (async ({ parent, params, fetch, locals: { supabase }  }) => {

	const { data, error } = await supabase
			.from('Texts2')
			.select('sentence, sentence_translation, simplified_sentence, sentence_word_translations, sentence_simplified_word_translations, sentence_simplified_translation')
			.eq('sentence_id', params.offset)
			.eq('text_id', params.id);
	if (error) {
			throw new Error('Error fetching sentence data: ' + error.message);	
		} 

	const sentence = data[0]?.sentence?.join('') ?? '';
	const simplifiedSentence = data[0]?.simplified_sentence?.join('') ?? '';

	// get chosen images for all potential characters, saved as traditional
	const chosenImages = await getImageChosenDict(
		sentence + simplifiedSentence, supabase
	);

	// get imageURLs for all potential characters, saved as traditional
	const urlDict = await getImageUrls(
		sentence + simplifiedSentence, supabase
	);

	updateCurrentSentence(sentence, supabase);

	return {
		sentence: sentence,
		simplifiedSentence: simplifiedSentence,
		words: data[0]?.sentence ?? [],
		wordsSimplified: data[0]?.simplified_sentence ?? [],
		sentenceTranslation: data[0]?.sentence_translation ?? '',
		sentenceWordTranslations: data[0]?.sentence_word_translations ?? [],
		sentenceSimplifiedWordTranslations: data[0]?.sentence_simplified_word_translations ?? [],
		sentenceSimplifiedTranslation: data[0]?.sentence_simplified_translation ?? '',
		chosenImages: chosenImages,
		imagePaths: urlDict,
	};
}) satisfies PageServerLoad;


async function updateCurrentSentence(currentSentence: string, supabase: any) {
	const { data: userData, error: userError } = await supabase.auth.getUser();

	if (userError) {
			console.error('Error fetching user data:', userError);
			return {
				success: false,
				message: 'Error fetching user data.'
			};
	}
	console.log(userData.user?.id);
    const { error } = await supabase
      .from('currentSentence')
      .upsert({ id: 0, sentence: currentSentence, user_id: userData.user?.id }, { onConflict: 'id' });

    if (error) {
      console.error('Error updating current sentence:', error);
    } 
//   else {
//     console.log('Current sentence updated successfully.');
//   }
}

// Convert the block to a function that gets a string and returns the imagesChosen Dict
async function getImageChosenDict(inputString: string, supabase: any) {
	const characterSet = new Set(inputString.split(''));
	const characterSetTraditional = s2t(characterSet);

	const { data: imageChosenData, error } = await supabase
		.from('MyKnownCharacters')
		.select('character, chosen_image')
		.in('character', [...characterSetTraditional]);
		
	if (error) {
		console.error('Error fetching image data:', error);
	}
	
	const imageChosen: { [key: string]: number } = {};
	imageChosenData?.forEach((row) => {
		imageChosen[row.character] = row.chosen_image;
	});

	return imageChosen;
}