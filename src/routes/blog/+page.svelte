<script lang="ts">
	import type { PageData } from './$types';
	import { Gallery, Button, Spinner, Card } from 'flowbite-svelte';

	export let data: PageData;
</script>

<svelte:head>
	<title>REAM Blog</title>
</svelte:head>

<main class="mx-auto max-w-3xl p-10">
	<h1 class="mb-6 text-4xl font-bold">REAM Blog</h1>

	<ul class="space-y-4">
		{#each data.blogEntries as entry}
			<li>
				<a
					href="/blog/{entry.slug}"
					class="text-xl text-blue-600 hover:underline dark:text-blue-400"
				>
					{entry.title}
				</a>
			</li>
		{/each}
	</ul>
</main>

<style>
	:global(body) {
		@apply bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-white;
	}
</style>
