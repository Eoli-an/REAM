import { readdir } from 'fs/promises';
import { join } from 'path';
import type { PageServerLoad } from './$types';

export const load = (async () => {
    // const blogDir = join(process.cwd(), 'src', 'routes', 'blog');
    // const entries = await readdir(blogDir, { withFileTypes: true });
    
    // const blogEntries = entries
    //     .filter(entry => entry.isDirectory() && entry.name !== 'tutorial')
    //     .map(entry => ({
    //         slug: entry.name,
    //         title: entry.name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
    //     }));

    // return {
    //     blogEntries
    // };
        const blogEntries = [
        { slug: 'tutorial', title: 'Tutorial' },
        { slug: 'study_introduction', title: 'Study Introduction' },
    ];

    return {
        blogEntries
    };
}) satisfies PageServerLoad;