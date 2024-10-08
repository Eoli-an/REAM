import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import { callLLM } from '../llmService';


export const POST: RequestHandler = async ({ request }) => {
    const { sentence} = await request.json();

    const systemPrompt = `translate the following the sentence I give you into english. Only output the translation.`;
    const sentenceTranslation = await callLLM(systemPrompt, sentence, true);

    return json({ sentenceTranslation }, { status: 201 });
};