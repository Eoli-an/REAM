import { writable } from 'svelte/store';
//import type { Database } from './database.types';

//type MyKnownWordsRow = Database['public']['Tables']['MyKnownWords']['Row'];
interface WordKnowledgeDict {
    [key: string]: number | null;
  }

export const wordKnowledge = writable<WordKnowledgeDict>({});