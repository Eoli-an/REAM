import type { PageServerLoad } from './$types';
import { getImageUrls } from '$lib/functions'; // Import getImageUrls
// @ts-ignore
import * as hanzi from 'hanzi';
// hanzi.start();

// @ts-ignore
import pkg from 'chinese-s2t';
const { s2t } = pkg;

export const load: PageServerLoad = (async ({ params, fetch, locals: { supabase } }) => {
    const char = params.char;

    // Uncomment and use if getImageUrls is needed
    // const imagePathsDict = await getImageUrls(s2t(char), supabase);
    // const imagePaths = imagePathsDict && imagePathsDict[s2t(char)] ? Object.values(imagePathsDict[s2t(char)]) : [];
    // console.log(imagePaths);
    // console.log("okok");

    const imageDataDict = await getImageData(s2t(char), supabase);

    const definition: any[] = hanzi.definitionLookup(char);
    // Remove duplicate definitions
    let uniqueDefinitions: any[];
    if (definition && definition.length > 0) {
        uniqueDefinitions = Array.from(
            new Map(definition.map(item => [JSON.stringify(item), item])).values()
        );
    } else {
        uniqueDefinitions = [{
            traditional: '',
            simplified: '',
            pinyin: '',
            definition: "no definition available"
        }];
    }
    const frequency = hanzi.getCharacterFrequency(char)['number'];

    const currentSentence = await getCurrentSentence(supabase);

    let explanation: string = '';
    if (currentSentence) {
        explanation = await getWordExplanation(currentSentence, char, fetch);
    } else {
        explanation = 'No current sentence available';
    }

    const decompositions = hanzi.decompose(char);

    if (decompositions && decompositions.components2) {
        decompositions.components2 = decompositions.components2.map((component: string) => {
            const meaning = hanzi.getRadicalMeaning(component);
            return meaning ? `${component} (${meaning})` : component;
        });
    }

    return {
        char: char,
        // imagePaths: imagePaths || [], // Update to use imagePaths directly
        imageDataDict: imageDataDict,
        definition: uniqueDefinitions,
        frequency: frequency,
        currentSentence: currentSentence,
        explanation: explanation,
        decompositions: decompositions
    };
}) satisfies PageServerLoad;

// Define ImageType based on your Supabase enum
type ImageType = 'Meaning' | 'Mnemonic'; // Add other types if necessary

interface ImageRow {
    id: string;
    char: string | null;
    created_at: string;
    explanation: string | null;
    index: number;
    prompt: string | null;
    type: ImageType | null;
}

async function getCurrentSentence(supabase: any) {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError) {
        console.error('Error fetching user data:', userError);
        return {
            success: false,
            message: 'Error fetching user data.'
        };
    }

    const { data: currentSentenceData, error } = await supabase
        .from('currentSentence')
        .select('sentence')
        .eq('user_id', userData.user?.id)
        .single();

    if (error) {
        console.error('Error fetching current sentence:', error);
        return 'Error fetching current sentence';
    }

    return currentSentenceData.sentence;
}

async function getWordExplanation(sentence: string, word: string, fetch: any): Promise<string> {
    const response = await fetch('/app/api/explain', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            sentence: sentence,
            word: word
        })
    });

    const data: { content: string } = await response.json();
    return data.content;
}

async function getImageData(char: string, supabase: any) {
    const { data: imageData, error: imageError } = await supabase
        .from('images')
        .select('id, index, explanation, prompt, type')
        .eq('char', char);

    if (imageError) {
        console.error('Error fetching image data:', imageError);
        return {};
    }

    const imageDict: { 
        Meaning: { [index: number]: { url: string, explanation: string, prompt: string } },
        Mnemonic: { [index: number]: { url: string, explanation: string, prompt: string } }
    } = { Meaning: {}, Mnemonic: {} };

    for (const row of imageData as ImageRow[]) {
        if (row.type === 'Meaning' || row.type === 'Mnemonic') { // Type guard
            const { data, error } = await supabase
                .storage
                .from('Images')
                .getPublicUrl(`images/${row.id}`);

            if (error) {
                console.error('Error fetching public URL:', error);
                continue; // Skip this iteration if there's an error
            }

            if (data.publicUrl) { // Ensure publicUrl exists
                imageDict[row.type][row.index] = {
                    url: data.publicUrl,
                    explanation: row.explanation || '',
                    prompt: row.prompt || ''
                };
            }
        } else {
            console.warn(`Unsupported image type: ${row.type} for image ID: ${row.id}`);
            // Optionally handle other types or skip
        }
    }

    return imageDict;
}
