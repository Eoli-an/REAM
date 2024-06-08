<script lang="ts">
	import { supabase } from '$lib/supabaseClient';
	async function updateDatabase(character: string, knowledgeLevel: number) {
		const { error } = await supabase
			.from('MyKnownCharacters') // Adjust the table name as needed
			.upsert({ character, knowledgeLevel }, { onConflict: 'character' });

		if (error) {
			console.error('Error updating database:', error);
		}
	}

	import type { PageData } from './$types';
	import { CharacterKnowledge } from '$lib';
	export let data: PageData;
	const char = data.char;
	const imagePaths = data.imagePaths;
	const definition = data.definition;
	console.log(definition);

	let selectedItem: 'word' | 'image' = 'image';

	function selectItem(type: 'word' | 'image') {
		selectedItem = type;
		if (type === 'word') {
			CharacterKnowledge.update((knowledge) => {
				knowledge[char] = 1;
				return knowledge;
			});
			updateDatabase(char, 1);
		} else if (type === 'image') {
			CharacterKnowledge.update((knowledge) => {
				knowledge[char] = 0;
				return knowledge;
			});
			updateDatabase(char, 0);
		}
		window.history.back();
	}
</script>

<div class="image-grid">
	<div class="grid-item">
		<h1 style="font-size: 20rem; margin-bottom: 0rem; margin-top: 10rem">{char}</h1>
		<button on:click={() => selectItem('word')}>Choose this</button>
	</div>
	{#if imagePaths.length > 0}
		{#each imagePaths as imagePath}
			<div class="grid-item">
				<img style="margin-top: 17rem;" src={imagePath} alt={char} />
				<button on:click={() => selectItem('image')}>Choose this</button>
			</div>
		{/each}
	{:else}
		<div class="grid-item">
			<p>No images available for this word.</p>
		</div>
	{/if}
</div>

<div class="definition-grid">
	{#each definition as item}
		<div class="grid-item">
			<p style="font-size: 1.5rem;">Definition: {item.definition}</p>
			<p style="font-size: 1.5rem;">{item.pinyin}</p>
		</div>
	{/each}
	<div class="grid-item">
		<p style="font-size: 1.5rem;">Frequency {data.frequency}</p>
	</div>
</div>

<style>
	.image-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		grid-gap: 1rem;
		margin-top: -13rem;
		margin-bottom: -10rem;
	}

	.grid-item {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.image-grid img {
		width: 50%;
		height: auto;
		object-fit: cover;
	}

	.definition-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		grid-gap: 1rem;
		margin-top: 20rem;
	}
</style>
