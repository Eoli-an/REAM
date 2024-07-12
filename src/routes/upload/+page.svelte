<script lang="ts">
	import type { ActionData, PageData } from './$types';
	import { Gallery } from 'flowbite-svelte';
	import { enhance } from '$app/forms';
	import { Spinner, Button } from 'flowbite-svelte';

	export let data: PageData;
	export let form: ActionData;

	let formLoading = false;
</script>

<form
	method="POST"
	action="?/uploadTextChinese"
	use:enhance={() => {
		formLoading = true;
		return async ({ update }) => {
			formLoading = false;
			update();
		};
	}}
	enctype="multipart/form-data"
	class="mt-4"
>
	<label>
		Upload a Chinese .txt file:
		<input type="file" name="file" accept=".txt" required />
	</label>
	<Button type="submit">Upload</Button>
</form>

<form
	method="POST"
	action="?/uploadTextEnglish"
	use:enhance={() => {
		formLoading = true;
		return async ({ update }) => {
			formLoading = false;
			update();
		};
	}}
	enctype="multipart/form-data"
	class="mt-4"
>
	<label>
		Upload an English .txt file:
		<input type="file" name="file" accept=".txt" required />
	</label>
	<Button type="submit">Upload</Button>
</form>

{#if formLoading}
	<Spinner />
{/if}

{#if form?.success}
	<p>{form.message}</p>
{/if}

<Gallery class="grid-cols-2 gap-4">
	{#each data.texts as text}
		<a
			href="/read/{text.text_id}"
			class="max-w- flex h-auto items-center justify-center rounded-lg bg-blue-300 text-6xl font-extrabold"
		>
			{text.title}
		</a>
	{/each}
</Gallery>
