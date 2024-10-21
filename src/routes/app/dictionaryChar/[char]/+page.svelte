<script lang="ts">
	import { Button, Spinner, AccordionItem, Accordion, Modal } from 'flowbite-svelte';
	import { CharacterKnowledge } from '$lib';
	import type { PageData } from './$types';
	import { ArrowLeftOutline } from 'flowbite-svelte-icons';

	// @ts-ignore
	import pkg from 'chinese-s2t';
	const { s2t } = pkg;

	export let data: PageData;
	const { char, imageDataDict, definition, frequency, decompositions } = data;
	$: ({ supabase } = data);

	async function updateDatabase(character: string, knowledgeLevel: number, chosen_image: number) {
		// ... (function remains the same)
	}

	function selectItem(type: 'word' | 'image', index: number) {
		// ... (function remains the same)
	}

	let showModal = {};
</script>

<Button
	on:click={() => window.history.back()}
	class="absolute left-2 top-12 flex items-center bg-white text-gray-800 hover:bg-gray-200 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
>
	<ArrowLeftOutline class="mr-2 h-5 w-5" />
	Back
</Button>

<div class="container mx-auto px-4 py-8">
	<div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
		<div
			class="flex flex-col items-center justify-center rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800"
		>
			<h1 class="mb-4 text-9xl">{char}</h1>
			<Button color="blue" on:click={() => selectItem('word', 0)}>Choose this</Button>
		</div>

		{#if Object.keys(imageDataDict).length > 0}
			{#each ['Meaning', 'Mnemonic'] as imageType}
				{#if Object.keys(imageDataDict[imageType]).length > 0}
					<div class="col-span-full">
						<h2 class="mb-2 text-2xl font-bold">{imageType} Images</h2>
						<hr class="mb-4 border-gray-300 dark:border-gray-600" />
					</div>
					{#each Object.keys(imageDataDict[imageType]) as index}
						<div
							class="flex flex-col items-center justify-center rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800"
						>
							<img
								src={imageDataDict[imageType][index].url}
								alt={char}
								class="mb-4 h-48 w-full object-contain"
							/>
							<div class="flex space-x-2">
								<Button color="blue" on:click={() => selectItem('image', +index)}
									>Choose this</Button
								>
								<Button color="gray" on:click={() => (showModal[`${imageType}-${index}`] = true)}
									>Info</Button
								>
							</div>
							<Modal
								title="Image Information"
								bind:open={showModal[`${imageType}-${index}`]}
								autoclose
								outsideclose
							>
								{#if imageDataDict[imageType][index].explanation || imageDataDict[imageType][index].prompt}
									<p class="text-base leading-relaxed text-gray-500 dark:text-gray-400">
										<strong>Explanation:</strong>
										{imageDataDict[imageType][index].explanation || 'No explanation available'}
									</p>
									<p class="text-base leading-relaxed text-gray-500 dark:text-gray-400">
										<strong>Prompt:</strong>
										{imageDataDict[imageType][index].prompt || 'No prompt available'}
									</p>
								{:else}
									<p class="text-base leading-relaxed text-gray-500 dark:text-gray-400">
										No information available
									</p>
								{/if}
								<svelte:fragment slot="footer">
									<Button on:click={() => (showModal[`${imageType}-${index}`] = false)}
										>Close</Button
									>
								</svelte:fragment>
							</Modal>
						</div>
					{/each}
				{/if}
			{/each}
		{:else}
			<div
				class="flex items-center justify-center rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800"
			>
				<p class="text-gray-500 dark:text-gray-400">No images available for this word.</p>
			</div>
		{/if}
	</div>

	<!-- ... (rest of the code remains the same) -->
</div>
