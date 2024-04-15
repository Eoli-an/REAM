import type { PageLoad } from './$types';
import fs from 'fs';
import path from 'path';

//https://kit.svelte.dev/docs/load#making-fetch-requests
export const load = (async ({fetch}) => {
    const response = await fetch('/harry_potter.txt');//SvelteKit automatically serves files from the static directory, so you can directly access the file using its relative path.
    const text = await response.text();
    return {
        text: text
    };
}) satisfies PageLoad;


