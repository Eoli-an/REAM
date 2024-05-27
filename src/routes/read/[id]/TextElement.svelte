<script lang="ts">
    import { updateDatabase } from '$lib'; 
    import CharElement from './CharElement.svelte';
    import {wordKnowledge} from '$lib'
    import { get } from 'svelte/store';


    export let word: string;
    export let pinyin_word: string;
    export let translation: string;
    export let imagePaths;


    let upperButtonDisplay = 'translation';

    const store_value = $wordKnowledge;
    $: {if (!(store_value.hasOwnProperty(word))) {
        upperButtonDisplay = 'translation';
    }
    else {
        if (store_value[word] === 0) {
            upperButtonDisplay = 'translation';
        }
        else if (store_value[word] === 1) {
            upperButtonDisplay = 'none';
        }
    }
    }


    function circleUpperButton() {
        if (upperButtonDisplay === 'translation') {
            upperButtonDisplay = 'none';
            wordKnowledge.update(knowledge => {
                knowledge[word] = 1;
                return knowledge;
            });
            updateDatabase(word, 1);
        } else if (upperButtonDisplay === 'none') {
            upperButtonDisplay = 'translation';
            wordKnowledge.update(knowledge => {
                knowledge[word] = 0;
                return knowledge;
            });
            updateDatabase(word, 0);
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
            <CharElement char = {char} imagePaths={imagePaths}/>
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