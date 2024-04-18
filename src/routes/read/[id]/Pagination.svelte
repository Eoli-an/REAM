<script lang="ts">
    import TextElement from './TextElement.svelte';

    export let words: string[];
    export let pinyin_words: string[];
    let simplifyToggle: boolean;
    // export let pos;
    // export let knowledge_level: number;


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

    // <span>&nbsp;</span>
</script>


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

