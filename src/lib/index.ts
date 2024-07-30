// place files you want to import through the `$lib` alias in this folder.
// TODO not sure why this is needed
export { supabase } from './supabaseClient';
export { wordKnowledge } from './stores';
export { CharacterKnowledge } from './stores';
export { currentSentence } from './stores';
export { currentSentenceWords } from './stores';
export { simplified } from './stores';

export { updateDatabase } from './functions';
export { updateDatabaseSentenceIndex } from './functions';
export { uploadDatabaseBook } from './functions';
export { getImageUrls } from './functions';