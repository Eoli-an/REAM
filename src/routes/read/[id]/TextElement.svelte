<script lang="ts">
    import { base } from '$app/paths';
    import wordKnowledgeData from '$lib/static/word_knowledge.json';
    import CharElement from './CharElement.svelte';

    export let word: string;
    //export let pinyin_word: string;
    export let translation: string;

    interface WordKnowledge {
        [key: string]: { knowledge_level: number };
    }

    // Cast the imported JSON to the correct type
    let wordKnowledge: WordKnowledge = wordKnowledgeData as WordKnowledge;


    let upperButtonDisplay = '';

    $: {
        if (wordKnowledge[word]) {
            upperButtonDisplay = 'none';
        }
        else {
            upperButtonDisplay = 'translation';
        }
    }

    function circleUpperButton() {
        if (upperButtonDisplay === 'translation') {
            upperButtonDisplay = 'none';
        } else if (upperButtonDisplay === 'none') {
            upperButtonDisplay = 'translation';
        }
    }


</script>

<div class="button-group">
    <button on:click={(e) => { circleUpperButton() }} class="upper-button">
        {#if upperButtonDisplay === 'translation'}
            {translation}
        {:else}
            ...
        {/if}
    </button>
    
    <button>
        {#each word.split('') as char}
            <CharElement {char} />
        {/each}
    </button>
</div>

<style>
    .button-group {
      display: inline-flex;
      flex-direction: column;
      align-items: center;
      
    }

    .upper-button {
      font-size: 6px;
      align-items: bottom;
      margin-bottom: 0px; /* Adjust the font size as needed */
    }

    button {
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

</style>