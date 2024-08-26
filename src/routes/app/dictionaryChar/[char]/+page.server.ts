import type { PageServerLoad } from './$types';
import { getImageUrls } from '$lib/functions'; // Import getImageUrls
// @ts-ignore
import * as hanzi from 'hanzi';
// hanzi.start();

// @ts-ignore
import pkg from 'chinese-s2t';
const { s2t } = pkg;


export const load = (async ({params, fetch, locals: { supabase }}) => {
    const char = params.char;

    // const imagePathsDict = await getImageUrls(s2t(char), supabase);
    // const imagePaths = imagePathsDict && imagePathsDict[s2t(char)] ? Object.values(imagePathsDict[s2t(char)]) : [];
    // console.log(imagePaths);
    // console.log("okok");

    const imageDataDict = await getImageData(s2t(char), supabase);

    const definition: any[] = hanzi.definitionLookup(char);
    // For some reason definitions come back multiple times
    let uniqueDefinitions: any[];
    if (definition && definition.length > 0) {
        uniqueDefinitions = Array.from(
            new Map(definition.map(item => [JSON.stringify(item), item])).values()
        );
    } else {
        uniqueDefinitions = [{
            traditional: '',
            simplified: '',
            pinyin: '',
            definition: "no definition available"
        }];
    }
    const frequency = hanzi.getCharacterFrequency(char)['number'];

    const currentSentence = await getCurrentSentence(supabase);

    let explanation: Promise<string> = Promise.resolve('');
    if (currentSentence) {
        explanation = getWordExplanation(currentSentence, char, fetch);
    }
    else {
        explanation = Promise.resolve('No current sentence available');
    }

    const decompositions = hanzi.decompose(char);

    if (decompositions && decompositions.components2) {
        decompositions.components2 = decompositions.components2.map((component: string) => {
            const meaning = hanzi.getRadicalMeaning(component);
            return meaning ? `${component} (${meaning})` : component;
        });
        
    }

    return {
        char: char,
        // imagePaths: imagePaths || [], // Update to use imagePaths directly
        imageDataDict: imageDataDict,
        definition: uniqueDefinitions,
        frequency: frequency,
        currentSentence: currentSentence,
        explanation: explanation,
        decompositions: decompositions
    };
}) satisfies PageServerLoad;

async function getCurrentSentence(supabase: any) {
  const { data: currentSentenceData, error } = await supabase
    .from('currentSentence')
    .select('sentence')
    .eq('id', 0)
    .single();

  if (error) {
    console.error('Error fetching current sentence:', error);
    return 'Error fetching current sentence';
  }

  return currentSentenceData.sentence;
}

async function getWordExplanation(sentence: string, word: string, fetch: any) {
    return fetch('/app/api/explain', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            sentence: sentence,
            word: word
        })
    })
    .then((response: Response) => response.json())
    .then((data: { content: string }) => data.content);
}

async function getImageData(char: string, supabase: any) {
    // Fetch image data including ids, indices, explanations, and prompts for the given character
    const { data: imageData, error: imageError } = await supabase
        .from('images')
        .select('id, index, explanation, prompt')
        .eq('char', char);

    if (imageError) {
        console.error('Error fetching image data:', imageError);
        return {};
    }

    const imageDict: { [index: number]: { url: string, explanation: string, prompt: string } } = {};
    for (const row of imageData) {
        const { data, error } = await supabase
            .storage
            .from('Images')
            .getPublicUrl(`images/${row.id}`);

        if (error) {
            console.error('Error fetching public URL:', error);
        } else {
            imageDict[row.index] = {
                url: data.publicUrl,
                explanation: row.explanation,
                prompt: row.prompt
            };
        }
    }

    return imageDict;
}