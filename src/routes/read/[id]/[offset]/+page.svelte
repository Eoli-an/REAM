<script lang="ts">
	import type { PageData } from './$types';
	import TextElement from './TextElement.svelte';
	import { currentSentenceWords } from '$lib';

	export let data: PageData;

	let showSentenceTranslation = false;

	$: sentenceTranslation = data.sentenceTranslation;
	$: wordTranslations = data.wordTranslations;
	// TODO make the snapshot work, I think the await needs to depend on if there already was a translation
	// export const snapshot = {
	// 	capture: () => [sentenceTranslation, wordTranslations],
	// 	restore: (value) => [sentenceTranslation, wordTranslations] = value
	// };

	// set the store to the current sentence
	$: currentSentenceWords.set(data.words.join(''));

	console.log(data.words.join(''));
</script>

<button
	class="mb-2 h-16 w-full cursor-pointer border-none bg-transparent p-0 text-2xl font-normal sm:text-3xl"
	on:click={() => (showSentenceTranslation = !showSentenceTranslation)}
>
	{#if showSentenceTranslation}
		{#await sentenceTranslation}
			loading...
		{:then sentenceTranslation}
			{sentenceTranslation}
		{:catch error}
			<p class="text-red-500">{error.message}</p>
		{/await}
	{:else}
		...
	{/if}
</button>
<hr class="divider my-10 border-t border-black sm:my-20" />

<div class="text-center">
	{#await wordTranslations}
		{#each data.words as word, i (i)}
			<TextElement
				{word}
				pinyin_word={'pinyin'}
				translation={'...'}
				imagePaths={data.imagePaths}
				imageChosen={data.imageChosen}
			/>
		{/each}
	{:then translations}
		{#each data.words as word, i (i)}
			<TextElement
				{word}
				pinyin_word={'pinyin'}
				translation={translations[i]}
				imagePaths={data.imagePaths}
				imageChosen={data.imageChosen}
			/>
		{/each}
	{:catch error}
		<p class="text-red-500">{error.message}</p>
	{/await}
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
