<script lang="ts">
    import wordKnowledgeData from '$lib/static/word_knowledge.json';

    export let char: string;


    interface WordKnowledge {
        [key: string]: { knowledge_level: number };
    }

    // Cast the imported JSON to the correct type
    let wordKnowledge: WordKnowledge = wordKnowledgeData as WordKnowledge;

    $: imagePath = `/images/${char}.png`;

    let displayType = '';

    $: {
        if (wordKnowledge[char]) {
            displayType = 'character';
        }
        else {
            displayType = 'image';
        }
    }

    function circle() {
        if (displayType === 'character') {
            displayType = 'image';
        } else if (displayType === 'image') {
            displayType = 'character';
        }
    }

    async function loadImage(src: string): Promise<string> {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(src);
            img.onerror = () => reject(new Error('Image failed to load'));
            img.src = src;
        });
    }

    $: imagePromise = loadImage(imagePath);
</script>


<button on:click={circle}>
    {#if displayType === 'character'}
        {char}
    {:else}
        {#await imagePromise}
            ...
        {:then src}
            <img src={src} alt={char}/>
        {:catch error}
            {char}
        {/await}
    {/if}
</button>


<style>
    button {
      width: 22px; /* Set the desired fixed width */
      height: 22px; /* Set the desired fixed height */
      background-color: transparent;
      border: none;
      border-radius: 0;
      padding: 4px 8px;
      font-size: 16px;
      cursor: pointer;
      margin-right: 0px;
      margin-bottom: 0px;
      margin-top: -6px;
    }

    img {
      width: 17px;
      height: auto;
      vertical-align: middle;
      margin-bottom: 4px;
    }
</style>