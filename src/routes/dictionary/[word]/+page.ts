import type { PageLoad } from './$types';

export const load = (async ({params, fetch}) => {
    const word = params.word;

    const response3 = await fetch('/images.json');
    const imagePaths = await response3.json();
    const imagePathsWord = imagePaths[word]


    return {
        word: word,
        imagePaths: imagePathsWord || []
    };
}) satisfies PageLoad;