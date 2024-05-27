<script lang="ts">
    import TextElement from './TextElement.svelte';
    import { onMount } from 'svelte';
    import { browser } from "$app/environment";

    export let words: string[];
    export let pinyin_words: string[];
    export let imagePaths;
    //export let simplifyToggle: boolean;
    let showSentenceTranslation = false;
    const dummySentenceTranslation = "This is a dummy sentence translation.";

    async function loadWordTranslations(words: string[]	) {
        const response = await fetch('/api/translate_words', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ text: words.join(''), words })
        });
        if (response.ok) {
            const data = await response.json();
            translations = data.outputList;
            //return data.outputList;
        } else {
            throw new Error('Failed to load translations');
        }
    }
    async function loadSentenceTranslations(words: string[]	) {
        const response = await fetch('/api/translate_sentence', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ sentence: words.join('')})
        });
        if (response.ok) {
            const data = await response.json();
            sentenceTranslation = data.sentenceTranslation;
            //return data.sentenceTranslation;
        } else {
            throw new Error('Failed to load sentence translation');
        }
    }
    // see https://stackoverflow.com/questions/76335938/how-to-use-reactive-statements-to-fetch-data-from-a-server-js-handler-in-svelte
    let translations : string[] = [];  
    let sentenceTranslation : string= '';

    // reset imemdiately when we navigate to a new page
    $: words, translations = [];  

    $: if (browser) {
        loadWordTranslations(words);
    }

    $: if (browser) {
        loadSentenceTranslations(words);
    }

    // $: translations = loadWordTranslations(words);
    // $: sentenceTranslation = loadSentenceTranslations(words);

</script>

<button class="sentence-translation-container" on:click={() => showSentenceTranslation = !showSentenceTranslation}>
    {#if showSentenceTranslation}
        {#await sentenceTranslation}
            loading...
        {:then sentenceTranslation}
            {sentenceTranslation}
        {:catch error}
            <p style="color: red">{error.message}</p>
        {/await}
    {:else}
        ...
    {/if}
</button>
<hr class="divider">

{#await translations}
    {#each words as word, i (i)}
        <TextElement word = {word} pinyin_word={pinyin_words[i]} translation={'...'} imagePaths={imagePaths}  />
    {/each}
{:then translations}
    {#each words as word, i (i)}
        <TextElement word = {word} pinyin_word={pinyin_words[i]} translation={translations[i]} imagePaths={imagePaths}/>
    {/each}
{:catch error}
    <p style="color: red">{error.message}</p>
{/await}



<style>
    .sentence-translation-container {
        cursor: pointer;
        font-size: 3rem;
        font-weight: normal;
        margin-bottom: 0.5rem;
        background-color: transparent;
        border: none;
        padding: 0;
    }

    .divider {
        border-top: 1px solid black;
        margin: 5rem 0;
    }
</style>