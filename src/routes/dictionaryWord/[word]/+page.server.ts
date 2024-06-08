import type { PageServerLoad } from './$types';
// @ts-ignore
import * as hanzi from 'hanzi';
hanzi.start();


export const load = (async ({params, fetch}) => {
    const word = params.word;

    const definition: any[] = hanzi.definitionLookup(word);
    console.log(definition);
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
    const frequency = hanzi.getCharacterFrequency(word)['number'];


    return {
        word: word,
        definition: uniqueDefinitions,
        frequency: frequency
    };
}) satisfies PageServerLoad;