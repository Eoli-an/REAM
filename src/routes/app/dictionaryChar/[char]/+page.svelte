<script lang="ts">
	import { Button, Spinner, AccordionItem, Accordion, Modal } from 'flowbite-svelte';
	import { CharacterKnowledge } from '$lib';
	import type { PageData } from './$types';
	// @ts-ignore
	import pkg from 'chinese-s2t';
	const { s2t } = pkg;

	export let data: PageData;
	const { char, imageDataDict, definition, frequency, decompositions } = data;
	$: ({ supabase } = data);

	async function updateDatabase(character: string, knowledgeLevel: number, chosen_image: number) {
		const { data: userData, error: userError } = await supabase.auth.getUser();

		if (userError) {
			console.error('Error fetching user data:', userError);
			return {
				success: false,
				message: 'Error fetching user data.'
			};
		}
		const { error } = await supabase
			.from('MyKnownCharacters')
			.upsert(
				{ character, knowledgeLevel, chosen_image, user_id: userData.user?.id },
				{ onConflict: ['character', 'user_id'] }
			);

		if (error) {
			console.error('Error updating database:', error);
		}
	}

	function selectItem(type: 'word' | 'image', index: number) {
		CharacterKnowledge.update((knowledge) => {
			knowledge[s2t(char)] = type === 'word' ? 1 : 0;
			return knowledge;
		});
		updateDatabase(s2t(char), type === 'word' ? 1 : 0, index);
		window.history.back();
	}

	let showModal = {};
</script>

<div class="container mx-auto px-4 py-8">
	<div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
		<div
			class="flex flex-col items-center justify-center rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800"
		>
			<h1 class="mb-4 text-9xl">{char}</h1>
			<Button color="blue" on:click={() => selectItem('word', 0)}>Choose this</Button>
		</div>

		{#if Object.keys(imageDataDict).length > 0}
			{#each Object.keys(imageDataDict) as index}
				<div
					class="flex flex-col items-center justify-center rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800"
				>
					<img src={imageDataDict[index].url} alt={char} class="mb-4 h-48 w-full object-contain" />
					<div class="flex space-x-2">
						<Button color="blue" on:click={() => selectItem('image', +index)}>Choose this</Button>
						<Button color="gray" on:click={() => (showModal[index] = true)}>Info</Button>
					</div>
					<Modal title="Image Information" bind:open={showModal[index]} autoclose outsideclose>
						{#if imageDataDict[index].explanation || imageDataDict[index].prompt}
							<p class="text-base leading-relaxed text-gray-500 dark:text-gray-400">
								<strong>Explanation:</strong>
								{imageDataDict[index].explanation || 'No explanation available'}
							</p>
							<p class="text-base leading-relaxed text-gray-500 dark:text-gray-400">
								<strong>Prompt:</strong>
								{imageDataDict[index].prompt || 'No prompt available'}
							</p>
						{:else}
							<p class="text-base leading-relaxed text-gray-500 dark:text-gray-400">
								No information available
							</p>
						{/if}
						<svelte:fragment slot="footer">
							<Button on:click={() => (showModal[index] = false)}>Close</Button>
						</svelte:fragment>
					</Modal>
				</div>
			{/each}
		{:else}
			<div
				class="flex items-center justify-center rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800"
			>
				<p class="text-gray-500 dark:text-gray-400">No images available for this word.</p>
			</div>
		{/if}
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
						<Spinner size="m" />
						<span class="ml-2">Loading explanation...</span>
					</div>
				{:then explanation}
					<p class="whitespace-pre-wrap text-gray-700 dark:text-gray-300">{explanation}</p>
				{:catch error}
					<p class="text-red-500">{error.message}</p>
				{/await}
			</AccordionItem>

			<AccordionItem>
				<span slot="header" class="text-xl font-semibold">Decomposition</span>
				<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
					<div class="rounded-lg bg-white p-4 shadow dark:bg-gray-800">
						<p class="mb-2 text-lg"><strong>Character:</strong> {decompositions.character}</p>
						<p class="text-lg">
							<strong>Components 1:</strong>
							{decompositions.components1.join(', ')}
						</p>
						<p class="text-lg">
							<strong>Components 2:</strong>
							{decompositions.components2.join(', ')}
						</p>
						<p class="text-lg">
							<strong>Components 3:</strong>
							{decompositions.components3.join(', ')}
						</p>
					</div>
				</div>
			</AccordionItem>
		</Accordion>
	</div>
</div>
