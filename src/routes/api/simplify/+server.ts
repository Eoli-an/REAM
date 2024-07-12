import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import { callLLM } from '../llmService';


export const POST: RequestHandler = async ({ request }) => {
    const { text } = await request.json();

    const systemPrompt = `Simplify the chinese text. Only output the simplified text, nothing else. Stick close to the meaning, but use as many
    HSK1-3 words as possible.`;

    const content = await callLLM(systemPrompt, text, false);

    return json({ content }, { status: 201 });
};