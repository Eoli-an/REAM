<script>
	import MarkdownRenderer from '$lib/MarkdownRenderer.svelte';
	export let data;
</script>

<svelte:head>
	<link
		href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Fira+Code&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<main class="mx-auto max-w-3xl p-10">
	<h1 class="mb-6 bg-center text-4xl font-bold">REAM Tutorial</h1>
	<!-- Added headline -->

	<article>
		<MarkdownRenderer content={data.content} />
	</article>
</main>

<style>
	:global(body) {
		@apply m-0 bg-gray-100 p-0 dark:bg-gray-900;
	}
</style>
