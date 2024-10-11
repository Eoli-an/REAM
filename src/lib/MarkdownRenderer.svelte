<script>
	import { onMount } from 'svelte';
	import { marked } from 'marked';

	export let content = '';
	let renderedContent = '';

	onMount(() => {
		renderedContent = marked(content);
	});
</script>

<div class="markdown-content">
	{@html renderedContent}
</div>

<style>
	.markdown-content {
		@apply font-sans leading-relaxed text-gray-900 dark:text-gray-100;
	}
	.markdown-content :global(h1) {
		@apply mb-4 text-4xl text-gray-900 dark:text-gray-100;
	}
	.markdown-content :global(h2) {
		@apply mb-3 mt-6 text-3xl text-gray-900 dark:text-gray-100;
	}
	.markdown-content :global(h3) {
		@apply mb-2 mt-5 text-2xl text-gray-900 dark:text-gray-100;
	}
	.markdown-content :global(p) {
		@apply mb-6 text-lg;
	}
	.markdown-content :global(ul),
	.markdown-content :global(ol) {
		@apply mb-6 list-disc pl-5;
	}
	.markdown-content :global(li) {
		@apply mb-2;
	}
	.markdown-content :global(a) {
		@apply text-blue-600 underline dark:text-blue-400;
	}
	.markdown-content :global(img) {
		max-width: 150%; /* Make image larger than text container */
		width: 150%; /* Set width to 120% of container */
		height: auto;
		display: block;
		margin: 2rem -25%; /* Create negative margin to extend beyond text */
		border-radius: 0.5rem; /* rounded-lg */
		box-shadow:
			0 4px 6px -1px rgba(0, 0, 0, 0.1),
			0 2px 4px -1px rgba(0, 0, 0, 0.06); /* shadow-md */
		background-color: white;
	}
	.markdown-content :global(blockquote) {
		@apply border-l-4 border-blue-600 pl-4 italic text-gray-700 dark:border-blue-400 dark:text-gray-300;
	}
	.markdown-content :global(code) {
		@apply rounded bg-gray-100 px-1 py-0.5 font-mono text-sm dark:bg-gray-800;
	}
	.markdown-content :global(pre) {
		@apply mb-6 overflow-x-auto rounded bg-gray-100 p-4 dark:bg-gray-800;
	}
	.markdown-content :global(pre code) {
		@apply bg-transparent p-0;
	}
</style>
