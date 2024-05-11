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

    function circleMain() {
        if (displayType === 'word') {
            displayType = 'pinyin';
        } else if (displayType === 'pinyin') {
            displayType = 'image_character';
        } else if (displayType === 'image_character') {
            displayType = 'image_word';
        } else if (displayType === 'image_word') {
            displayType = 'word';
        }
    }

    function circleTranslation() {
        if (displayType === 'translation') {
            displayType = 'none';
        } else {
            displayType = 'translation';
        }
    }

    $: {
        if (displayType === 'pinyin') {
            displayText = pinyin_word;
        } else if (displayType === 'translation') {
            displayText = translation;
        } else if (displayType === 'none') {
            displayText = '';
        } else {
            displayText = word;
        }
    }

    let hideTranslation = false;

</script>

<div class="button-group">
    <button on:click={(e) => { hideTranslation = !hideTranslation }} class="hint-button">
        {#if hideTranslation}
            ...
        {:else}
            {translation}
        {/if}
    </button>
    <button on:click={circleMain}>
        {#if displayType === 'image_character'}
            {#each imageCharacterPaths as src}
                <img src={src} alt={word} on:error={(e) => e.target.src = `/images/default.png`}>&nbsp;
            {/each}
        {:else if displayType === 'image_word'}
            <img src={imageWordPath} alt={word} on:error={(e) => e.target.src =  `/images/default.png`}>
        {:else if displayType !== 'none'}
            {displayText}
        {/if}
    </button>
</div>

<style>
    .button-group {
      display: inline-flex;
      flex-direction: column;
      align-items: center;
      
    }

    .hint-button {
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

    img {
      width: 22px;
      height: auto;
      vertical-align: middle;
      margin-bottom: 4px;
    }
</style>