<script>
	import '../app.css';
	import { DarkMode } from 'flowbite-svelte';
</script>

<DarkMode />
<slot></slot>

<style>
	:global(body) {
		@apply bg-white text-gray-900 dark:bg-gray-900 dark:text-white;
	}
</style>
