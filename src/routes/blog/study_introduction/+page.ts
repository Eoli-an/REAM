import type { PageLoad } from './$types';

export const load = (async ({fetch}) => {
    const response = await fetch('/study_introduction.md');
  const content = await response.text();
  return { content };
}) satisfies PageLoad;