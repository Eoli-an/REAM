<script lang="ts">
    import { base } from '$app/paths';
    import CharElement from './CharElement.svelte';
    import {wordKnowledge} from '$lib'




    export let word: string;
    export let pinyin_word: string;
    export let translation: string;


    let upperButtonDisplay = '';

    $: wordKnowledge.subscribe(value => {
        if (value[word]) { //value[word] !== undefined
            upperButtonDisplay = 'none';
        }
        else {
            upperButtonDisplay = 'translation';
        }
    });


    function circleUpperButton() {
        if (upperButtonDisplay === 'translation') {
            upperButtonDisplay = 'none';
            wordKnowledge.update(knowledge => {
                knowledge[word] = 1;
                return knowledge;
            });
        } else if (upperButtonDisplay === 'none') {
            upperButtonDisplay = 'translation';
            wordKnowledge.update(knowledge => {
                knowledge[word] = 0;
                return knowledge;
            });
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
            <CharElement {char}/>
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