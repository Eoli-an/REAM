<script lang="ts">
    import { base } from '$app/paths';

    export let word: string;
    export let pinyin_word: string;
    export let translation: string;

    let displayType = 'word'; // Possible values: 'word', 'pinyin', 'translation', 'image_character', 'image_word'
    let displayText: string;

    let imageCharacterPaths: string[] = [];
    let imageWordPath: string;

    // sourcepath of images for individual characters
    imageCharacterPaths = word.split('').map(char => `/images/${char}.png`);
    // sourcepath of image for the whole word
    imageWordPath = `/images/${word}.png`;

    function circleThrough() {
        if (displayType === 'word') {
            displayType = 'pinyin';
        } else if (displayType === 'pinyin') {
            displayType = 'translation';
        } else if (displayType === 'translation') {
            displayType = 'image_character';
        } else if (displayType === 'image_character') {
            displayType = 'image_word';
        } else if (displayType === 'image_word') {
            displayType = 'word';
        }
    }

    $: {
        if (displayType === 'pinyin') {
            displayText = pinyin_word;
        } else if (displayType === 'translation') {
            displayText = translation;
        } else {
            displayText = word;
        }
    }

</script>

<button on:click={circleThrough}>
    {#if displayType === 'image_character'}
        {#each imageCharacterPaths as src}
            <img src={src} alt={word} on:error={(e) => e.target.src = word}>&nbsp;
        {/each}
    {:else if displayType === 'image_word'}
        <img src={imageWordPath} alt={word} on:error={(e) => e.target.src = word}>
    {:else}
        {displayText}
    {/if}
</button>

<style>
    button {
      background-color: transparent;
      border: none;
      border-radius: 0;
      padding: 8px 16px;
      font-size: 16px;
      cursor: pointer;
    }

    img {
      width: 22px;
      height: auto;
      vertical-align: middle;
      margin-bottom: 4px;
    }
</style>