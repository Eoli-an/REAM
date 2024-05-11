<script lang="ts">
    import TextElement from './TextElement.svelte';

    export let words: string[];
    export let pinyin_words: string[];
    export let simplifyToggle: boolean;
    let showSentenceTranslation = false;
    const dummySentenceTranslation = "This is a dummy sentence translation.";

    async function loadTranslations(words: string[]	) {
        const response = await fetch('/api/translate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ text: words.join(''), words })
        });
        if (response.ok) {
            const data = await response.json();
            return data.outputList;
        } else {
            throw new Error('Failed to load translations');
        }
    }

    $: translations = loadTranslations(words);
</script>

<div class="sentence-translation-container" on:click={() => showSentenceTranslation = !showSentenceTranslation}>
    {#if showSentenceTranslation}
        <div class="sentence-translation">
            {dummySentenceTranslation}
        </div>
        <hr class="divider">
    {/if}
</div>

{#await translations}
    {#each words as word, i (i)}
        <TextElement word = {word} pinyin_word={pinyin_words[i]} translation={'...'}/>
    {/each}
{:then translations}
    {#each words as word, i (i)}
        <TextElement word = {word} pinyin_word={pinyin_words[i]} translation={translations[i]}/>
    {/each}
{:catch error}
    <p style="color: red">{error.message}</p>
{/await}

<style>
    .sentence-translation-container {
        cursor: pointer;
    }

    .sentence-translation {
        font-size: 1rem;
        font-weight: normal;
        margin-bottom: 0.5rem;
    }

    .divider {
        border-top: 1px solid black;
        margin: 0.5rem 0;
    }
</style>