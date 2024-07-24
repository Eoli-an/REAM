<script lang="ts">
	import { onMount } from 'svelte';

	// onMount(() => {
	// 	document.documentElement.setAttribute('data-theme', 'dark');
	// });

	import { wordKnowledge, CharacterKnowledge } from '$lib/stores';
	import { updateDatabaseSentenceIndex } from '$lib';
	import type { LayoutData } from './$types';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { preloadCode, preloadData } from '$app/navigation';
	import { BottomNav, BottomNavItem, Tooltip } from 'flowbite-svelte';
	import { AngleLeftOutline, AngleRightOutline, HomeOutline } from 'flowbite-svelte-icons';

	export let data: LayoutData;

	//TODO get that right here with the reactivity
	// const text_cut = data.text_cut;
	// const pinyin_cut = data.pinyin_cut;
	const sentenceOffsets = data.sentenceOffsets;
	const wordKnowledgeData = data.wordKnowledgeData;
	const charKnowledgeData = data.characterKnowledgeData;
	// const imagePaths = data.imagePaths;
	const currentId = data.currentId;
	let currentSentenceIndex = data.currentSentenceIndex;

	wordKnowledgeData?.forEach((item) => {
		wordKnowledge.update((knowledge) => {
			knowledge[item.wordChinese] = item.knowledgeLevel;
			return knowledge;
		});
	});

	charKnowledgeData?.forEach((item) => {
		CharacterKnowledge.update((knowledge) => {
			knowledge[item.character] = item.knowledgeLevel;
			return knowledge;
		});
	});

	//TODO get the preload right, I think only one page can be preloaded at a time
	// $: preloadData(`/read/${currentId}/${currentSentenceIndex + 1}`);
	// $: preloadData(`/read/${currentId}/${currentSentenceIndex - 1}`);

	function goBack() {
		if (currentSentenceIndex > 0) {
			currentSentenceIndex--;
			updateDatabaseSentenceIndex(currentSentenceIndex, currentId);
			goto(`/read/${currentId}/${currentSentenceIndex}`);
		}
	}

	function goForward() {
		// if (currentSentenceIndex) {
		currentSentenceIndex++;
		updateDatabaseSentenceIndex(currentSentenceIndex, currentId);
		goto(`/read/${currentId}/${currentSentenceIndex}`);
		// }
	}

	if (browser) {
		goto(`/read/${currentId}/${currentSentenceIndex}`);
	}
</script>

<slot></slot>

<BottomNav position="fixed" navType="pagination" classInner="grid-cols-3">
	<BottomNavItem btnName="Previous Sentence" on:click={goBack}>
		<AngleLeftOutline
			class="mb-1 h-6 w-6 text-gray-500 group-hover:text-primary-600 dark:text-gray-400 dark:group-hover:text-primary-500"
		/>
		<!-- <Tooltip arrow={false}>Previous Sentence</Tooltip> -->
	</BottomNavItem>
	<BottomNavItem btnName="Home" href="/upload">
		<HomeOutline
			class="mb-1 h-6 w-6 text-gray-500 group-hover:text-primary-600 dark:text-gray-400 dark:group-hover:text-primary-500"
		/>
		<!-- <Tooltip arrow={false}>Home</Tooltip> -->
	</BottomNavItem>
	<BottomNavItem btnName="Next Sentence" on:click={goForward}>
		<AngleRightOutline
			class="mb-1 h-6 w-6 text-gray-500 group-hover:text-primary-600 dark:text-gray-400 dark:group-hover:text-primary-500"
		/>
		<!-- <Tooltip arrow={false}>Next Sentence</Tooltip> -->
	</BottomNavItem>
</BottomNav>
