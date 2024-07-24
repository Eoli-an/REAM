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
	import { Button, Spinner, Accordion, AccordionItem } from 'flowbite-svelte';
	// import { ArrowLeftIcon } from 'flowbite-svelte-icons';
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
			<a href="/dictionaryChar/{char}" class="mb-2 rounded bg-gray-100 shadow dark:bg-gray-800">
				<h1 class="text-[6rem] sm:text-[14rem]">{char}</h1>
			</a>
		{/each}
	</div>

	<div class="flex flex-row space-x-4">
		<Button on:click={() => update(0)} color="alternative" size="lg">Show translation</Button>
		<Button on:click={() => update(1)} color="alternative" size="lg">Hide translation</Button>
	</div>
</div>

<div class="mt-12">
	<Accordion flush>
		<AccordionItem>
			<span slot="header" class="text-xl font-semibold">Definitions</span>
			<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
				{#each definition as item}
					<div class="rounded-lg bg-white p-4 shadow dark:bg-gray-800">
						<p class="mb-2 text-lg"><strong>Definition:</strong> {item.definition}</p>
						<p class="text-lg"><strong>Pinyin:</strong> {item.pinyin}</p>
					</div>
				{/each}
			</div>
		</AccordionItem>

		<AccordionItem>
			<span slot="header" class="text-xl font-semibold">Frequency</span>
			<p class="text-lg">Frequency: {frequency}</p>
		</AccordionItem>

		<AccordionItem>
			<span slot="header" class="text-xl font-semibold">Explanation</span>
			{#await data.explanation}
				<div class="flex items-center justify-center">
					<Spinner size="xl" />
					<span class="ml-2">Loading explanation...</span>
				</div>
			{:then explanation}
				<p class="whitespace-pre-wrap text-gray-700 dark:text-gray-300">{explanation}</p>
			{:catch error}
				<p class="text-red-500">{error.message}</p>
			{/await}
		</AccordionItem>
	</Accordion>
</div>

<!-- <style>
	.definition-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		grid-gap: 1rem;
		margin-top: 5rem;
	}

	.definition {
		margin-top: 10rem;
		display: flex;
		justify-content: center;
		align-items: center;
		height: 1rem; /* Adjust the height as needed */
		font-size: 1.6rem;
	}
</style> -->
