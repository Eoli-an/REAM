import type { PageServerLoad } from './$types';
// @ts-ignore
import * as hanzi from 'hanzi';
// hanzi.start();


export const load = (async ({params, fetch, locals: { supabase }}) => {
    const word = params.word;

    const definition: any[] = hanzi.definitionLookup(word);
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
    const frequency = hanzi.getCharacterFrequency(word)['number'];
    const currentSentence = await getCurrentSentence(supabase);

    let explanation: Promise<string> = Promise.resolve('');
    if (currentSentence) {
        explanation = getWordExplanation(currentSentence, word, fetch);
    }
    else {
        explanation = Promise.resolve('No current sentence available');
    }



    return {
        word: word,
        definition: uniqueDefinitions,
        frequency: frequency,
        currentSentence: currentSentence,
        explanation: explanation
    };
}) satisfies PageServerLoad;

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
    .eq('user_id',  userData.user?.id )
    .single();

  if (error) {
    console.error('Error fetching current sentence:', error);
    return 'Error fetching current sentence';
  }

  return currentSentenceData.sentence;
}

async function getWordExplanation(sentence: string, word: string, fetch: any) {
    return fetch('/app/api/explain', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            sentence: sentence,
            word: word
        })
    })
    .then((response: Response) => response.json())
    .then((data: { content: string }) => data.content);
}