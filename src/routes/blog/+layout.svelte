<script lang="ts">
	import type { LayoutData } from './$types';
	import { Gallery, Button, Spinner, Card } from 'flowbite-svelte';

	export let data: LayoutData;
</script>

<header>
	<nav>
		<Button
			href="/"
			color="dark"
			class="mr-2 bg-white text-gray-800 dark:bg-gray-800 dark:text-white">Home</Button
		>
		<Button
			on:click={() => window.history.back()}
			class="mr-2 bg-white text-gray-800 dark:bg-gray-800 dark:text-white">Back</Button
		>
	</nav>
</header>

<slot></slot>
