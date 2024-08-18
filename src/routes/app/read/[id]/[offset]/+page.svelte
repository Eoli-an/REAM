<script lang="ts">
	import type { PageData } from './$types';
	import TextElement from './TextElement.svelte';
	import { currentSentenceWords } from '$lib';
	import { simplified } from '$lib';

	export let data: PageData;
	$: ({ supabase } = data);

	let showSentenceTranslation = false;

	// set the store to the current sentence
	$: currentSentenceWords.set(data.sentence);
</script>

<button
	class="mb-2 h-16 w-full cursor-pointer border-none bg-transparent p-0 text-2xl font-normal sm:text-3xl"
	on:click={() => (showSentenceTranslation = !showSentenceTranslation)}
>
	{#if showSentenceTranslation}
		{#if !$simplified}
			{data.sentenceTranslation}
		{:else}
			{data.sentenceSimplifiedTranslation}
		{/if}
	{:else}
		...
	{/if}
</button>
<hr class="divider my-10 border-t border-black sm:my-20" />

<div class="text-center">
	{#if !$simplified}
		{#each data.words as word, i (i)}
			<TextElement
				{word}
				pinyin_word={'pinyin'}
				translation={data.sentenceWordTranslations[i]}
				imagePaths={data.imagePaths}
				imageChosen={data.chosenImages}
				{supabase}
			/>
		{/each}
	{:else}
		{#each data.wordsSimplified as word, i (i)}
			<TextElement
				{word}
				pinyin_word={'pinyin'}
				translation={data.sentenceSimplifiedWordTranslations[i]}
				imagePaths={data.imagePaths}
				imageChosen={data.chosenImages}
				{supabase}
			/>
		{/each}
	{/if}
</div>

<!-- <style>
	.sentence-translation-container {
		cursor: pointer;
		font-size: 3rem;
		font-weight: normal;
		margin-bottom: 0.5rem;
		background-color: transparent;
		border: none;
		padding: 0;
	}

	.divider {
		border-top: 1px solid black;
		margin: 5rem 0;
	}
</style> -->
