import type { PageServerLoad } from './$types';
import { supabase } from '$lib/supabaseClient';
// @ts-ignore
import * as hanzi from 'hanzi';
// hanzi.start();


export const load = (async ({params, fetch}) => {
    const char = params.char;

    const response3 = await fetch('/images.json');
    const imagePaths = await response3.json();
    const imagePathsWord = imagePaths[char];

    const definition: any[] = hanzi.definitionLookup(char);
    const uniqueDefinitions: any[] = Array.from(
    new Map(definition.map(item => [JSON.stringify(item), item])).values()
    );
    const frequency = hanzi.getCharacterFrequency(char)['number'];

    const currentSentence = await getCurrentSentence();

    let explanation: Promise<string> = Promise.resolve('');
    if (currentSentence) {
        explanation = getWordExplanation(currentSentence, char, fetch);
    }
    else {
        explanation = Promise.resolve('No current sentence available');
    }


    return {
        char: char,
        imagePaths: imagePathsWord || [],
        definition: uniqueDefinitions,
        frequency: frequency,
        currentSentence: currentSentence,
        explanation: explanation,
    };
}) satisfies PageServerLoad;


async function getCurrentSentence() {
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
    return fetch('/api/explain', {
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