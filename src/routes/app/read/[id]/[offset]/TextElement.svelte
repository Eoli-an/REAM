<script lang="ts">
	import CharElement from './CharElement.svelte';
	import { wordKnowledge } from '$lib';
	import { Dropdown, DropdownItem } from 'flowbite-svelte';
	// @ts-ignore
	import pkg from 'chinese-s2t';
	const { s2t } = pkg;

	export let word: string;
	export let pinyin_word: string;
	export let translation: string;
	export let imagePaths;
	export let imageChosen;
	export let supabase: any;
	export let uniqueId: string; // Receive the unique ID make the dropdown work correctly

	let upperButtonDisplay = 'translation';

	$: isAllChinese = /^[\u4e00-\u9fa5]+$/.test(word);

	$: {
		const wordKey = s2t(word);
		const knowledgeLevel = $wordKnowledge[wordKey];
		if (knowledgeLevel === 1) {
			upperButtonDisplay = 'none';
		} else {
			upperButtonDisplay = 'translation';
		}
	}

	async function updateDatabase(word: string, knowledgeLevel: number) {
		const { data: userData, error: userError } = await supabase.auth.getUser();

		if (userError) {
			console.error('Error fetching user data:', userError);
			return {
				success: false,
				message: 'Error fetching user data.'
			};
		}
		const { error } = await supabase
			.from('MyKnownWords')
			.upsert(
				{ wordChinese: word, knowledgeLevel: knowledgeLevel, user_id: userData.user?.id },
				{ onConflict: ['wordChinese', 'user_id'] }
			);

		if (error) {
			console.error('Error updating database:', error);
		}
	}

	function toggle() {
		const wordKey = s2t(word);
		const newKnowledgeLevel = $wordKnowledge[wordKey] === 0 ? 1 : 0;
		wordKnowledge.update((knowledge) => {
			return { ...knowledge, [wordKey]: newKnowledgeLevel };
		});
		updateDatabase(wordKey, newKnowledgeLevel);
	}

	let charContainer: HTMLDivElement;
</script>

<div class="mb-8 mr-4 mt-0 inline-flex flex-col items-center sm:mb-16 sm:mr-8">
	{#if isAllChinese}
		<Dropdown placement="top" triggeredBy="#translation-dropdown-{uniqueId}">
			<DropdownItem on:click={toggle}>Switch</DropdownItem>
			<DropdownItem href={`/app/dictionaryWord/${word}`}>Explanation</DropdownItem>
		</Dropdown>
		<button
			id="translation-dropdown-{uniqueId}"
			class="upper-button h-6 w-full cursor-pointer border-none bg-gray-100 sm:h-8 dark:bg-gray-800"
		>
			{#if upperButtonDisplay === 'translation'}
				{translation}
			{:else}
				...
			{/if}
		</button>
	{:else}
		<button
			class="upper-button h-6 w-full cursor-pointer border-none bg-transparent sm:h-8 dark:bg-transparent"
		></button>
	{/if}

	<div bind:this={charContainer} class="chars mr-0 flex flex-wrap justify-center">
		{#each word.split('') as char}
			<CharElement {char} {imagePaths} {imageChosen} {supabase} />
		{/each}
	</div>
</div>
