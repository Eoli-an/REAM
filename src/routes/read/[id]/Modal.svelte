<script lang="ts">
    import { Carousel } from 'flowbite-svelte';


    export let close;
    export let char;
    export let imagePaths;
    export let chosen_image;
    export let circle; // this is a function that will be passed from the parent component
    export let imageError;
    console.log(imageError);
    // TODO does not relly work see https://www.shaunchander.me/effective-modals-in-sveltekit
  //   const portal = (/** @type {any} */ node) => {
	// document.querySelector('main')?.appendChild(node).focus();
  //   };

    console.log(imagePaths[char]);

    function convertSrcList(srcList: string[]) {
      return srcList.map(src => ({
        src: src, // Convert backslashes to forward slashes
        alt: 'Random Alt Text', // Replace with your logic for generating random alt text
        title: 'Random Title' // Replace with your logic for generating random title
      }));
    }
    const images = convertSrcList(imagePaths[char]);


  </script>


  
  <div class="modal-backdrop" on:click={close}>
    <div class="modal-content" on:click|stopPropagation>
      <div class="modal-header">
        <div class="modal-char">{char}</div>
        <div class="modal-image">
            {#if imageError}
                <p>No image available yet</p>
            {:else}
            <div class="modal-image">
                <Carousel style="height: 200px"{images} let:Controls>
                  <Controls />
                </Carousel>
                <!-- <img src={imagePaths[char][chosen_image]} alt={char} /> -->
              </div>
            {/if}
        </div>
      </div>
      <div class="modal-body">
        <p>Additional info...</p>
        <p>This is a good/bad character to learn in this text as it occurs often/not very often</p>
      </div>
      <div class="modal-footer">
        <button class="known" on:click={circle}>Known ✓</button>
        <button class="want-to-learn">Want to learn</button>
        <button class="dont-know">Not known</button>
      </div>
    </div>
  </div>
  
  <style>
    .modal-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .modal-content {
      background: gainsboro;
      padding: 1rem;
      border-radius: 8px;
      width: 1000px;
      height: 600px;
      /* max-width: 500px; /* Set a maximum width to prevent the modal from becoming too large */
      /* max-height: 400px; Set a maximum height to prevent the modal from becoming too tall */ 
      /* width: 40vw;
      height: 40vh; */
      text-align: center;
      overflow-y: auto;
    }
    .modal-header {
      display: flex;
      justify-content: space-between;
    }
    .modal-char {
      flex: 1;
      font-size: 3.5rem;
      color: black;
    }
    /* .modal-image {
      flex: 1;
      color: black;
      font-size: 0.7rem;
      height: 150px;
      width: 150px;
    } */
    .modal-image {
      width: 30px;
      height: auto;
    }
    .modal-body {
      margin: 1rem 0;
      font-size: 0.7rem;
      color: black;
    }
    .modal-footer {
      display: flex;
      justify-content: space-between;
    }
    .modal-footer button {
      padding: 0.5rem 1rem;
      border: none;
      cursor: pointer;
      border-radius: 5px;
    }
    .known {
      background-color: green;
      color: white;
    }
    .want-to-learn {
      background-color: orange;
      color: white;
    }
    .dont-know {
      background-color: red;
      color: white;
    }
  </style>
  