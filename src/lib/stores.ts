import { writable } from 'svelte/store';
//import type { Database } from './database.types';

//type MyKnownWordsRow = Database['public']['Tables']['MyKnownWords']['Row'];
interface WordKnowledgeDict {
    [key: string]: number | null;
  }

export const wordKnowledge = writable<WordKnowledgeDict>({});

// interface CurrentSentence {
//     sentenceIndex: number;
// }

// export const currentSentence = writable<CurrentSentence>({sentenceIndex: 0});

export const currentSentence = writable(0);