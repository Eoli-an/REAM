import type { PageServerLoad } from './$types';
// @ts-ignore
import * as hanzi from 'hanzi';
hanzi.start();


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


    return {
        char: char,
        imagePaths: imagePathsWord || [],
        definition: uniqueDefinitions,
        frequency: frequency
    };
}) satisfies PageServerLoad;