<script lang="ts">
    import type { PageData } from './$types';
    import TextElement from './TextElement.svelte';
    
    export let data: PageData;


    let showSentenceTranslation = false;



    $: sentenceTranslation= data.sentenceTranslation;
    $: wordTranslations = data.wordTranslations;
    // TODO make the snapshot work, I think the await needs to depend on if there already was a translation
    // export const snapshot = {
	// 	capture: () => [sentenceTranslation, wordTranslations],
	// 	restore: (value) => [sentenceTranslation, wordTranslations] = value
	// };

    
    console.log(data.words.join(''))

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

{#await wordTranslations}
    {#each data.words as word, i (i)}
        <TextElement word = {word} pinyin_word={'pinyin'} translation={'...'} imagePaths={data.imagePaths}  />
    {/each}
{:then translations}
    {#each data.words as word, i (i)}
        <TextElement word = {word} pinyin_word={'pinyin'} translation={translations[i]} imagePaths={data.imagePaths}/>
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