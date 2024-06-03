import type { PageServerLoad } from './$types';
// @ts-ignore
import * as hanzi from 'hanzi';
hanzi.start();

export const load = (async ({params, fetch}) => {
    const word = params.word;

    const response3 = await fetch('/images.json');
    const imagePaths = await response3.json();
    const imagePathsWord = imagePaths[word]

    const definition: any[] = hanzi.definitionLookup(word);
    const uniqueDefinitions: any[] = Array.from(
    new Map(definition.map(item => [JSON.stringify(item), item])).values()
    );
    const frequency = hanzi.getCharacterFrequency(word)['number'];


    return {
        word: word,
        imagePaths: imagePathsWord || [],
        definition: uniqueDefinitions,
        frequency: frequency
    };
}) satisfies PageServerLoad;