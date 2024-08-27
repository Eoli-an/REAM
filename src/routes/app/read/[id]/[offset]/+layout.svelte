<script lang="ts">
	import type { LayoutData } from './$types';
	import { Drawer, Button, CloseButton, Toggle } from 'flowbite-svelte';
	import { simplified } from '$lib';
	import { character_set } from '$lib';
	import { sineIn } from 'svelte/easing';
	import { AdjustmentsHorizontalOutline } from 'flowbite-svelte-icons';

	let hidden6 = true;
	let transitionParamsRight = {
		x: 320,
		duration: 200,
		easing: sineIn
	};

	export let data: LayoutData;

	import { setContext } from 'svelte';
	import { writable } from 'svelte/store';

	// const simplified = writable(false);
	// setContext('simplified', simplified);

	function toggleSimplified() {
		simplified.set(!$simplified);
	}
	function toggleCharacterSet() {
		character_set.set($character_set === 'simplified' ? 'traditional' : 'simplified');
	}
</script>

<slot></slot>

<div class="fixed right-0 top-0">
	<Button
		on:click={() => (hidden6 = false)}
		class="border-none bg-transparent shadow-none hover:bg-gray-200 dark:border-none dark:bg-transparent dark:hover:bg-gray-700"
	>
		<AdjustmentsHorizontalOutline class="h-6 w-6 text-gray-500 dark:text-gray-400" />
	</Button>
</div>

<Drawer
	placement="right"
	transitionType="fly"
	transitionParams={transitionParamsRight}
	bind:hidden={hidden6}
	id="sidebar6"
>
	<div class="flex items-center">
		<h5
			id="drawer-label"
			class="mb-4 inline-flex items-center text-base font-semibold text-gray-500 dark:text-gray-400"
		>
			<AdjustmentsHorizontalOutline class="h-6 w-6 text-gray-500 dark:text-gray-400" /> Settings
		</h5>
		<CloseButton on:click={() => (hidden6 = true)} class="mb-4 dark:text-white" />
	</div>

	<div class="mt-8"></div>

	<div class="flex items-center">
		<Toggle on:change={toggleSimplified} checked={$simplified}></Toggle>
		<p class="ml-2">Use LLM-based Simplification</p>
	</div>

	<div class="mt-4 flex items-center">
		<!-- Added mt-4 for margin-top -->
		<Toggle on:change={toggleCharacterSet} checked={$character_set === 'traditional'}></Toggle>
		<p class="ml-2">Use Traditional Characters</p>
	</div>
</Drawer>
