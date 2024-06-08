<script lang="ts">
	import { CharacterKnowledge } from '$lib';
	import { goto } from '$app/navigation';

	export let char: string;
	export let imagePaths;

	// console.log(`Character: ${char}, Image Paths: ${imagePaths[char]}`);

	let chosen_image = 0; //TODO pass down later from parent
	let imagePath: string;
	let image_available = false;

	// check if there is a image available and choose the image if yes
	$: if (imagePaths.hasOwnProperty(char)) {
		image_available = true;
		imagePath = imagePaths[char][chosen_image];
	}

	let displayType: string = 'image';
	const store_value = $CharacterKnowledge;

	// determine the display type of the character
	$: {
		if (!store_value.hasOwnProperty(char)) {
			displayType = 'image';
		} else {
			if (store_value[char] === 0) {
				displayType = 'image';
			} else if (store_value[char] === 1) {
				displayType = 'character';
			}
		}
	}

	// function circle() {
	//     if (displayType === 'character') {
	//         displayType = 'image';
	//         wordKnowledge.update(knowledge => {
	//             knowledge[char] = 0;
	//             return knowledge;
	//         });
	//         updateDatabase(char, 0);
	//     } else if (displayType === 'image') {
	//         displayType = 'character';
	//         wordKnowledge.update(knowledge => {
	//             knowledge[char] = 1;
	//             return knowledge;
	//         });
	//         updateDatabase(char, 1);
	//     }
	//     close();
	// }
</script>

<button on:click={() => goto(`/dictionaryChar/${char}`)}>
	{#if displayType === 'character'}
		{char}
	{:else if image_available}
		<img src={imagePath} alt={char} />
	{:else}
		{char}
	{/if}
</button>

<style>
	button {
		width: 80px; /* Set the desired fixed width */
		height: 80px; /* Set the desired fixed height */
		background-color: transparent;
		border: none;
		/* border-radius: 0; */
		/* padding: 4px 8px; */
		font-size: 60px;
		cursor: pointer;
		margin-right: 0px;
		margin-bottom: 0px;
		margin-top: 0px;
		margin-left: 0px;
		padding: 0px;
	}

	img {
		width: 70px;
		height: auto;
		vertical-align: middle;
		margin-right: 0px;
		margin-bottom: 0px;
		margin-top: -6px;
	}
</style>
