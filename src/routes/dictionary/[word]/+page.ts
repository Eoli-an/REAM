import type { PageLoad } from './$types';

export const load = (async ({params}) => {
    return {
        word: params.word
    };
}) satisfies PageLoad;