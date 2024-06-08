<script lang="ts">
	import { updateDatabase } from '$lib';
	import CharElement from './CharElement.svelte';
	import { wordKnowledge } from '$lib';
	import { goto } from '$app/navigation';

	export let word: string;
	export let pinyin_word: string;
	export let translation: string;
	export let imagePaths;

	let upperButtonDisplay = 'translation';

	const store_value = $wordKnowledge;
	$: {
		if (!store_value.hasOwnProperty(word)) {
			upperButtonDisplay = 'translation';
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

<div class="button-group">
	<button
		on:click={(e) => {
			goto(`/dictionaryWord/${word}`);
		}}
		class="upper-button"
		style="width: {charContainerWidth}px; height:30px"
	>
		{#if upperButtonDisplay === 'translation'}
			{translation}
		{:else}
			...
		{/if}
	</button>

	<div bind:this={charContainer} class="chars">
		{#each word.split('') as char}
			<CharElement {char} {imagePaths} />
		{/each}
	</div>
</div>

<style>
	.button-group {
		display: inline-flex;
		flex-direction: column;
		align-items: center;
		margin-top: 0px;
		margin-bottom: 30px;
		margin-right: 30px;
	}

	.chars {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		margin-right: 0px;
	}

	.upper-button {
		font-size: 20px;
		align-items: bottom;
		margin-bottom: -4px; /* Adjust the font size as needed */
	}

	button {
		background-color: transparent;
		border: none;
		border-radius: 0;
		/* padding: 4px 8px; */
		font-size: 16px;
		cursor: pointer;
		margin-right: 0px;
		margin-bottom: 0px;
		margin-top: -6px;
	}
</style>
