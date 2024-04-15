import type { PageLoad } from './$types';
import {cut} from '@node-rs/jieba';

// @node-rs/jieba only works on server
export const csr = false;

//https://kit.svelte.dev/docs/load#making-fetch-requests
export const load = (async ({fetch}) => {
    const response = await fetch('/harry_potter.txt');//SvelteKit automatically serves files from the static directory, so you can directly access the file using its relative path.
    const text = await response.text();
    const text_cut = cut(text);

    const response2 = await fetch('/my_known_words.json');
    const knownWords = await response2.json();
    return {
        text: text,
        knownWords: knownWords,
        text_cut: text_cut
    };
}) satisfies PageLoad;


