<script lang="ts">
	import { updateDatabase } from '$lib';
	import CharElement from './CharElement.svelte';
	import { wordKnowledge } from '$lib';
	import { goto } from '$app/navigation';

	export let word: string;
	export let pinyin_word: string;
	export let translation: string;
	export let imagePaths;
	export let imageChosen;
	export let supabase: any;

	let upperButtonDisplay = 'none';

	$: isAllChinese = /^[\u4e00-\u9fa5]+$/.test(word);

	const store_value = $wordKnowledge;
	$: {
		if (!store_value.hasOwnProperty(word)) {
			upperButtonDisplay = 'none';
		} else {
			if (store_value[word] === 0) {
				upperButtonDisplay = 'translation';
			} else if (store_value[word] === 1) {
				upperButtonDisplay = 'none';
			}
		}
	}

	// function circleUpperButton() {
	//     if (upperButtonDisplay === 'translation') {
	//         upperButtonDisplay = 'none';
	//         wordKnowledge.update(knowledge => {
	//             knowledge[word] = 1;
	//             return knowledge;
	//         });
	//         updateDatabase(word, 1);
	//     } else if (upperButtonDisplay === 'none') {
	//         upperButtonDisplay = 'translation';
	//         wordKnowledge.update(knowledge => {
	//             knowledge[word] = 0;
	//             return knowledge;
	//         });
	//         updateDatabase(word, 0);
	//     }
	// }
	// let charContainerWidth = 0;
	// function measureCharContainerWidth(node: HTMLDivElement) {
	//     charContainerWidth = node.offsetWidth;
	// }

	let charContainer: HTMLDivElement;
	$: charContainerWidth = charContainer ? charContainer.offsetWidth : 0;
</script>

<div class="mb-8 mr-4 mt-0 inline-flex flex-col items-center sm:mb-16 sm:mr-8">
	{#if isAllChinese}
		<button
			on:click={(e) => {
				goto(`/app/dictionaryWord/${word}`);
			}}
			class="upper-button h-6 w-full cursor-pointer border-none bg-transparent sm:h-8 dark:bg-transparent"
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
