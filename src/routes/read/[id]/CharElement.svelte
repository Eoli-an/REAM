<script lang="ts">
    import { updateDatabase } from '$lib'; 
    import { browser } from '$app/environment'; 
    import { wordKnowledge } from '$lib';
    import Modal from './Modal.svelte';

    export let char: string;

    $: imagePath = `/images/${char}.png`;

    let displayType: string = '';
    let showModal = false;
    let imageError = false;

    const store_value = $wordKnowledge;

    $: {
        if (!(store_value.hasOwnProperty(char))) {
            displayType = 'image';
        }
        else {
            if (store_value[char] === 0) {
                displayType = 'image';
            }
            else if (store_value[char] === 1) {
                displayType = 'character';
            }
        }
    }

    function circle() {
        if (displayType === 'character') {
            displayType = 'image';
            wordKnowledge.update(knowledge => {
                knowledge[char] = 0;
                return knowledge;
            });
            updateDatabase(char, 0);
        } else if (displayType === 'image') {
            displayType = 'character';
            wordKnowledge.update(knowledge => {
                knowledge[char] = 1;
                return knowledge;
            });
            updateDatabase(char, 1);
        }
        close();
    }

    function close() {
        showModal = false;
    }

    async function loadImage(src: string): Promise<string> {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(src);
            img.onerror = () => {
                imageError = true;
                reject(new Error('Image failed to load'));
            };
            img.src = src;
        });
    }

    $: imagePromise = loadImage(imagePath);

</script>

<button on:click={() => showModal = true}>
    {#await imagePromise}
        ...
    {:then src}
        {#if displayType === 'character'}
            {char}
        {:else}
            <img src={src} alt={char}/>
        {/if}
    {:catch error}
        {char}
    {/await}
</button>

{#if showModal}
    <Modal {close} {char} {imagePath} {circle} {imageError}/>
{/if}

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
