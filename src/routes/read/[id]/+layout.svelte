<script lang="ts">
	import { onMount } from 'svelte';

	onMount(() => {
		document.documentElement.setAttribute('data-theme', 'dark');
	});

	import { wordKnowledge } from '$lib/stores';
	import { updateDatabaseSentenceIndex } from '$lib';
	import type { LayoutData } from './$types';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { preloadCode, preloadData } from '$app/navigation';

	export let data: LayoutData;

	//TODO get that right here with the reactivity
	const text_cut = data.text_cut;
	const pinyin_cut = data.pinyin_cut;
	const sentenceOffsets = data.sentenceOffsets;
	const wordKnowledgeData = data.wordKnowledgeData;
	const imagePaths = data.imagePaths;
	const currentId = data.currentId;
	let currentSentenceIndex = data.currentSentenceIndex;

	wordKnowledgeData?.forEach((item) => {
		wordKnowledge.update((knowledge) => {
			knowledge[item.wordChinese] = item.knowledgeLevel;
			return knowledge;
		});
	});

	//TODO get the preload right, I think only one page can be preloaded at a time
	// $: preloadData(`/read/${currentId}/${currentSentenceIndex + 1}`);
	// $: preloadData(`/read/${currentId}/${currentSentenceIndex - 1}`);

	function goBack() {
		if (currentSentenceIndex > 0) {
			currentSentenceIndex--;
			updateDatabaseSentenceIndex(currentSentenceIndex);
			goto(`/read/${currentId}/${currentSentenceIndex}`);
		}
	}

	function goForward() {
		if (currentSentenceIndex < sentenceOffsets.length - 1) {
			currentSentenceIndex++;
			updateDatabaseSentenceIndex(currentSentenceIndex);
			goto(`/read/${currentId}/${currentSentenceIndex}`);
		}
	}
	if (browser) {
		goto(`/read/${currentId}/${currentSentenceIndex}`);
	}
</script>

<slot></slot>

<div class="navigation">
	<button class="nav-button" on:click={goBack}>Previous Sentence</button>
	<button class="nav-button" on:click={goForward}>Next Sentence</button>
</div>

<style>
	.navigation {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		background-color: var(--background-color);
		padding: 10px;
		display: flex;
		justify-content: space-between;
		z-index: 100;
	}

	.content {
		margin-top: 20px;
	}

	.nav-button {
		background-color: var(--button-background);
		color: var(--button-text);
		border: none;
		border-radius: 4px;
		padding: 4px 8px;
		font-size: 30px;
		cursor: pointer;
		margin-right: 8px;
	}

	:global([data-theme='dark']) {
		--background-color: black;
		--text-color: #ffffff;
		--button-background: #333333;
		--button-text: #ffffff;
	}

	:global(body) {
		background-color: var(--background-color);
		color: var(--text-color);
	}

	:global(button) {
		background-color: var(--button-background);
		color: var(--button-text);
	}
</style>
