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

<div class="flex flex-col items-center">
	<div class="flex flex-row space-x-4">
		{#each word.split('') as char}
			<a href="/dictionaryChar/{char}">
				<h1 class="text-[14rem]">{char}</h1>
			</a>
		{/each}
	</div>

	<Button on:click={() => update(0)} color="alternative" size="lg" class="mb-2">
		Show translation
	</Button>
	<Button on:click={() => update(1)} color="alternative" size="lg">Hide translation</Button>
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
	.definition-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		grid-gap: 1rem;
		margin-top: 5rem;
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
