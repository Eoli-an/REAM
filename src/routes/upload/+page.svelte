<script lang="ts">
	import type { ActionData, PageData } from './$types';
	import { Gallery } from 'flowbite-svelte';
	import { enhance } from '$app/forms';

	export let data: PageData;
	export let form: ActionData;
</script>

<form method="POST" action="?/uploadTextChinese" use:enhance enctype="multipart/form-data">
	<label>
		Upload a Chinese .txt file:
		<input type="file" name="file" accept=".txt" required />
	</label>
	<button type="submit">Upload</button>
</form>

<form
	method="POST"
	action="?/uploadTextEnglish"
	use:enhance
	enctype="multipart/form-data"
	class="mt-4"
>
	<label>
		Upload an English .txt file:
		<input type="file" name="file" accept=".txt" required />
	</label>
	<button type="submit">Upload</button>
</form>

{#if form?.success}
	<p>{form.message}</p>
{/if}

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
