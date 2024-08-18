import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit'

export const load = (async () => {
    throw redirect(302, '/auth/login'); // Specify the path you want to redirect to
}) satisfies PageServerLoad;