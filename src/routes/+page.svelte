<script lang="ts">
	import type { ActionData, PageData } from './$types';
	import { Gallery, Button, Card } from 'flowbite-svelte';
	import { enhance } from '$app/forms';

	export let data: PageData;
	export let form: ActionData;

	let formLoading = false;

	const features = [
		{
			title: 'AI-Powered Simplification',
			description: 'Adjust text complexity to match your level.'
		},
		{
			title: 'Semantic Scaffolding',
			description: 'Enhance comprehension with context-aware translations.'
		},
		{
			title: 'Mnemonic Integration',
			description: 'Use AI-generated mnemonics for better retention.'
		}
	];
</script>

<main class="bg-gray-100">
	<nav class="border-gray-200 bg-white p-4 dark:bg-gray-900">
		<!-- Add navigation content here -->
	</nav>

	<header class="relative bg-white py-12 text-center dark:bg-gray-900">
		<h1 class="mb-4 text-4xl font-extrabold text-gray-900 dark:text-white">
			Revolutionize Your Chinese Learning
		</h1>
		<p class="mb-8 text-lg text-gray-500 dark:text-gray-400">
			REAM: AI-powered simplification, translation, and semantic scaffolding.
		</p>
		<Button href="/upload" color="blue">Get Started</Button>
	</header>

	<section class="bg-white py-12 dark:bg-gray-900">
		<div class="mx-auto max-w-screen-xl px-4">
			<h2 class="mb-8 text-center text-3xl font-bold">Key Features</h2>
			<div class="grid gap-8 md:grid-cols-3">
				{#each features as feature}
					<Card>
						<h3 class="mb-2 text-xl font-bold">{feature.title}</h3>
						<p>{feature.description}</p>
					</Card>
				{/each}
			</div>
		</div>
	</section>

	<section class="bg-gray-50 py-12 dark:bg-gray-800">
		<div class="mx-auto max-w-screen-xl px-4">
			<h2 class="mb-8 text-center text-3xl font-bold">About REAM</h2>
			<p class="mb-8 text-center text-gray-500 dark:text-gray-400">
				REAM revolutionizes Chinese learning by combining AI technology with proven language
				acquisition techniques.
			</p>
			<div class="text-center">
				<Button color="blue">Learn More</Button>
			</div>
		</div>
	</section>
</main>

<style>
	/* Add any custom styles here */
</style>
