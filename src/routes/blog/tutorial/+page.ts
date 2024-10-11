import type { PageLoad } from './$types';

export const load = (async ({fetch}) => {
    const response = await fetch('/explainer_screen.md');
  const content = await response.text();
  return { content };
}) satisfies PageLoad;