<script lang="ts">
	import type { PageData } from './$types';
	import { Gallery } from 'flowbite-svelte';

	export let data: PageData;
</script>

<Gallery class="grid-cols-2 gap-4">
	{#each data.texts as text}
		<a
			href="/read/{text.text_id}"
			class="max-w- flex h-auto items-center justify-center rounded-lg bg-blue-300 text-6xl font-extrabold"
		>
			{text.text_id}
		</a>
	{/each}
</Gallery>
