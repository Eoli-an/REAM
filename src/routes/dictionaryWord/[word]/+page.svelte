<script lang="ts">
	import { supabase } from '$lib/supabaseClient';
	import { currentSentenceWords } from '$lib';
	async function updateDatabase(wordChinese: string, knowledgeLevel: number) {
		const { error } = await supabase
			.from('MyKnownWords') // Adjust the table name as needed
			.upsert({ wordChinese, knowledgeLevel }, { onConflict: 'wordChinese' });

		if (error) {
			console.error('Error updating database:', error);
		}
	}
	import type { PageData } from './$types';
	import { wordKnowledge } from '$lib';
	import { Button, Spinner } from 'flowbite-svelte';
	import CharElement from '../../read/[id]/[offset]/CharElement.svelte';

	export let data: PageData;
	const word = data.word;
	const definition = data.definition;
	const frequency = data.frequency;

	function update(knowledgeLevel: number) {
		wordKnowledge.update((knowledge) => {
			knowledge[word] = knowledgeLevel;
			return knowledge;
		});
		updateDatabase(word, knowledgeLevel);
		window.history.back();
	}

	console.log(currentSentenceWords);
</script>

<div class="word-grid">
	<div class="grid-item">
		<h1 style="font-size: 20rem; margin-bottom: 0rem; margin-top: 10rem">{word}</h1>
		<Button on:click={() => update(0)} color="alternative" size="md" class="mb-2"
			>Show translation</Button
		>
		<Button on:click={() => update(1)} color="alternative" size="md">Hide translation</Button>
	</div>
</div>

<div class="definition-grid">
	{#each definition as item}
		<div class="grid-item">
			<p style="font-size: 1.5rem;">Definition: {item.definition}</p>
			<p style="font-size: 1.5rem;">{item.pinyin}</p>
		</div>
	{/each}
	<div class="grid-item">
		<p style="font-size: 1.5rem;">Frequency {frequency}</p>
	</div>
</div>

<div class="definition">
	{#await data.explanation}
		<Spinner /> loading explanation...
	{:then explanation}
		<p>{explanation}</p>
	{:catch error}
		<p style="color: red">{error.message}</p>
	{/await}
</div>

<style>
	.word-grid {
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

	.definition-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		grid-gap: 1rem;
		margin-top: 20rem;
	}

	.definition {
		margin-top: 5rem;
		display: flex;
		justify-content: center;
		align-items: center;
		height: 1rem; /* Adjust the height as needed */
		font-size: 1.6rem;
	}
</style>
