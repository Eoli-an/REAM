<script lang="ts">
    import { updateDatabase } from '$lib'; 
    import { browser } from '$app/environment'; 
    import { wordKnowledge } from '$lib';
    import Modal from './Modal.svelte';
    
    // import { getModalStore } from '@skeletonlabs/skeleton';
    // import type { ModalSettings } from '@skeletonlabs/skeleton';
    // import { Modal as ModalFlowbite, Button as ButtonFlowbite} from 'flowbite-svelte';
			
    // const modalStore = getModalStore();
    
    // const modal: ModalSettings = {
    //     type: 'alert',
    //     // Data
    //     title: 'Example Alert',
    //     body: 'This is an example modal.',
    //     image: 'https://i.imgur.com/WOgTG96.gif',
    // };
    

                        

    export let char: string;
    export let imagePaths;
    
    let chosen_image = 0; //TODO pass down later from parent
    let imagePath: string;
    let image_available = false;

    // check if there is a image available and choose the image if yes
    $: if (imagePaths.hasOwnProperty(char)) {
        image_available = true;
        imagePath = imagePaths[char][chosen_image];
    }



    let displayType: string = 'image';
    let showModal = false;
    let imageError = false;


    const store_value = $wordKnowledge;

    // determine the display type of the character
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


</script>

<button on:click={() => showModal = true}>
    {#if displayType === 'character'}
        {char}
    {:else if image_available}
        <img src={imagePath} alt={char}/>
    {:else}
        {char}
    {/if}
</button>

<!-- <ModalFlowbite title="Terms of Service" bind:open={defaultModal} autoclose>
    <p class="text-base leading-relaxed text-gray-500 dark:text-gray-400">With less than a month to go before the European Union enacts new consumer privacy laws for its citizens, companies around the world are updating their terms of service agreements to comply.</p>
    <p class="text-base leading-relaxed text-gray-500 dark:text-gray-400">The European Union’s General Data Protection Regulation (G.D.P.R.) goes into effect on May 25 and is meant to ensure a common set of data rights in the European Union. It requires organizations to notify users as soon as possible of high-risk data breaches that could personally affect them.</p>
    <svelte:fragment slot="footer">
      <ButtonFlowbite on:click={() => alert('Handle "success"')}>I accept</ButtonFlowbite>
      <ButtonFlowbite color="alternative">Decline</ButtonFlowbite>
    </svelte:fragment>
  </ModalFlowbite> -->

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
