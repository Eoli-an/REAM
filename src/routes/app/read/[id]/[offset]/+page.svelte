<script lang="ts">
	import type { PageData } from './$types';
	import TextElement from './TextElement.svelte';
	import { currentSentenceWords, simplified, character_set } from '$lib';
	// @ts-ignore
	import pkg from 'chinese-s2t';
	const { s2t, t2s } = pkg;

	export let data: PageData;
	$: ({ supabase } = data);

	let showSentenceTranslation = false;

	// Set the store to the current sentence
	$: currentSentenceWords.set(data.sentence);
</script>

{#if data.sentence === ''}
	<!-- ... -->
{:else}
	<!-- ... -->
	<div class="text-center">
		{#if $character_set === 'simplified'}
			{#if !$simplified}
				{#each data.words as word, i (i)}
					<TextElement
						word={t2s(word)}
						pinyin_word={'pinyin'}
						translation={data.sentenceWordTranslations[i]}
						imagePaths={data.imagePaths}
						imageChosen={data.chosenImages}
						{supabase}
						uniqueId={`text-element-${i}`}
					/>
				{/each}
			{:else}
				{#each data.wordsSimplified as word, i (i)}
					<TextElement
						word={t2s(word)}
						pinyin_word={'pinyin'}
						translation={data.sentenceSimplifiedWordTranslations[i]}
						imagePaths={data.imagePaths}
						imageChosen={data.chosenImages}
						{supabase}
						uniqueId={`text-element-${i}`}
					/>
				{/each}
			{/if}
		{:else if !$simplified}
			{#each data.words as word, i (i)}
				<TextElement
					word={s2t(word)}
					pinyin_word={'pinyin'}
					translation={data.sentenceWordTranslations[i]}
					imagePaths={data.imagePaths}
					imageChosen={data.chosenImages}
					{supabase}
					uniqueId={`text-element-${i}`}
				/>
			{/each}
		{:else}
			{#each data.wordsSimplified as word, i (i)}
				<TextElement
					word={s2t(word)}
					pinyin_word={'pinyin'}
					translation={data.sentenceSimplifiedWordTranslations[i]}
					imagePaths={data.imagePaths}
					imageChosen={data.chosenImages}
					{supabase}
					uniqueId={`text-element-${i}`}
				/>
			{/each}
		{/if}
	</div>
{/if}
