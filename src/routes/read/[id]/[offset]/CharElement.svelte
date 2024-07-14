<script lang="ts">
	import { CharacterKnowledge } from '$lib';
	import { goto } from '$app/navigation';

	export let char: string;
	export let imagePaths;
	export let imageChosen;

	let chosen_image = 0;
	let imagePath: string;
	let image_available = false;

	$: {
		if (imageChosen.hasOwnProperty(char)) {
			chosen_image = imageChosen[char];
		}
	}

	console.log(imagePaths);

	$: if (imagePaths.hasOwnProperty(char)) {
		image_available = true;
		imagePath = imagePaths[char][chosen_image];
		console.log(imagePath);
	}

	let displayType: string = 'image';
	const store_value = $CharacterKnowledge;

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

	async function updateDatabase(character: string, knowledgeLevel: number, chosen_image: number) {
		const { supabase } = await import('$lib/supabaseClient');
		const { error } = await supabase
			.from('MyKnownCharacters') // Adjust the table name as needed
			.upsert({ character, knowledgeLevel, chosen_image }, { onConflict: 'character' });

		if (error) {
			console.error('Error updating database:', error);
		}
	}

	function circle() {
		if (displayType === 'character') {
			displayType = 'image';
			CharacterKnowledge.update((knowledge) => {
				knowledge[char] = 0;
				return knowledge;
			});
			updateDatabase(char, 0, chosen_image);
		} else if (displayType === 'image') {
			displayType = 'character';
			CharacterKnowledge.update((knowledge) => {
				knowledge[char] = 1;
				return knowledge;
			});
			updateDatabase(char, 1, chosen_image);
		}
	}
</script>

<button on:click={circle}>
	{#if displayType === 'character'}
		{char}
	{:else if image_available}
		<img src={imagePath} alt={char} />
	{:else}
		{char}
	{/if}
</button>

<!-- <button on:click={() => goto(`/dictionaryChar/${char}`)}> -->

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
		font-size: 70px;
	}

	img {
		width: 70px;
		height: auto;
		vertical-align: middle;
		margin-right: 0px;
		margin-bottom: 0px;
		margin-top: 20px;
	}
</style>
