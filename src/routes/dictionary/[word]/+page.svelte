<script lang="ts">
    import type { PageData } from './$types';
    import { wordKnowledge } from '$lib';
    import { updateDatabase } from '$lib';

    export let data: PageData;
    const word = data.word;
    const imagePaths = data.imagePaths;
    const definition = data.definition;
    console.log(definition);

    let selectedItem: 'word' | 'image' = 'image';

    function selectItem(type: 'word' | 'image') {
        selectedItem = type;
        if (type === 'word') {
            wordKnowledge.update(knowledge => {
                knowledge[word] = 1;
                return knowledge;
            });
            updateDatabase(word, 1);
        } else if (type === 'image') {
            wordKnowledge.update(knowledge => {
                knowledge[word] = 0;
                return knowledge;
            });
            updateDatabase(word, 0);
        }
    }
</script>

<div class="image-grid">
    <div class="grid-item">
        <h1 style="font-size: 20rem; margin-bottom: 0rem;">{word}</h1>
        <button on:click={() => selectItem('word')}>Choose this</button>
    </div>
    {#if imagePaths.length > 0}
        {#each imagePaths as imagePath}
            <div class="grid-item">
                <img style="margin-top: 17rem;"src={imagePath} alt={word} />
                <button on:click={() => selectItem('image')}>Choose this</button>
            </div>
        {/each}
    {:else}
        <div class="grid-item">
            <p>No images available for this word.</p>
            <button on:click={() => selectItem('word')}>Choose this</button>
        </div>
    {/if}
</div>

<div class="definition-grid">
    {#each definition as item}
        <div class="grid-item">
            <p style="font-size: 1.5rem;">Definition: {item.definition}</p>
            <p style="font-size: 1.5rem;">{item.pinyin}</p>
        </div>
    {/each}
    <div class="grid-item">
        <p style="font-size: 1.5rem;">Frequency {data.frequency}</p>
    </div>
</div>

<style>
    .image-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        grid-gap: 1rem;
        margin-top: -13rem;
        margin-bottom: -10rem;
    }

    .grid-item {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    .image-grid img {
        width: 50%;
        height: auto;
        object-fit: cover;
    }

    .definition-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        grid-gap: 1rem;
        margin-top: 20rem;
    }
</style>