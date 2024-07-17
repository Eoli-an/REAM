<script lang="ts">
	import type { ActionData, PageData } from './$types';
	import { Gallery, Button, Spinner, Card } from 'flowbite-svelte';
	import { enhance } from '$app/forms';

	export let data: PageData;
	export let form: ActionData;

	let formLoading = false;

	const handleSubmit = () => {
		return () => {
			formLoading = true;
			return async ({ update }: { update: () => void }) => {
				formLoading = false;
				update();
			};
		};
	};
</script>

<div class="mx-auto max-w-4xl space-y-8 p-6">
	<h1 class="mb-6 text-3xl font-bold text-gray-800">Text Upload</h1>

	<div class="grid gap-6 md:grid-cols-2">
		<Card>
			<form
				method="POST"
				action="?/uploadTextChinese"
				use:enhance={handleSubmit()}
				enctype="multipart/form-data"
				class="space-y-4"
			>
				<h2 class="text-xl font-semibold text-gray-700">Upload Chinese Text</h2>
				<div class="flex w-full items-center justify-center">
					<label
						for="chinese-file-upload"
						class="flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100"
					>
						<div class="flex flex-col items-center justify-center pb-6 pt-5">
							<svg
								class="mb-4 h-8 w-8 text-gray-500"
								aria-hidden="true"
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 20 16"
							>
								<path
									stroke="currentColor"
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
								/>
							</svg>
							<p class="mb-2 text-sm text-gray-500">
								<span class="font-semibold">Click to upload</span> or drag and drop
							</p>
							<p class="text-xs text-gray-500">TXT file only</p>
						</div>
						<input
							id="chinese-file-upload"
							type="file"
							name="file"
							accept=".txt"
							class="hidden"
							required
						/>
					</label>
				</div>
				<Button type="submit" class="w-full">
					{#if formLoading}
						<Spinner class="mr-3" size="4" />
					{/if}
					Upload Chinese Text
				</Button>
			</form>
		</Card>

		<Card>
			<form
				method="POST"
				action="?/uploadTextEnglish"
				use:enhance={handleSubmit()}
				enctype="multipart/form-data"
				class="space-y-4"
			>
				<h2 class="text-xl font-semibold text-gray-700">Upload English Text</h2>
				<div class="flex w-full items-center justify-center">
					<label
						for="english-file-upload"
						class="flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100"
					>
						<div class="flex flex-col items-center justify-center pb-6 pt-5">
							<svg
								class="mb-4 h-8 w-8 text-gray-500"
								aria-hidden="true"
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 20 16"
							>
								<path
									stroke="currentColor"
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
								/>
							</svg>
							<p class="mb-2 text-sm text-gray-500">
								<span class="font-semibold">Click to upload</span> or drag and drop
							</p>
							<p class="text-xs text-gray-500">TXT file only</p>
						</div>
						<input
							id="english-file-upload"
							type="file"
							name="file"
							accept=".txt"
							class="hidden"
							required
						/>
					</label>
				</div>
				<Button type="submit" class="w-full">
					{#if formLoading}
						<Spinner class="mr-3" size="4" />
					{/if}
					Upload English Text
				</Button>
			</form>
		</Card>
	</div>

	{#if form?.success}
		<div class="border-l-4 border-green-500 bg-green-100 p-4 text-green-700" role="alert">
			<p class="font-bold">Success</p>
			<p>{form.message}</p>
		</div>
	{/if}

	<div class="mt-8">
		<h2 class="mb-4 text-2xl font-bold text-gray-800">Available Texts</h2>
		<Gallery class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
			{#each data.texts as text}
				<a
					href="/read/{text.text_id}"
					class="flex h-32 items-center justify-center rounded-lg bg-blue-100 p-4 text-center transition-colors duration-200 hover:bg-blue-200"
				>
					<span class="text-lg font-semibold text-blue-800">{text.title}</span>
				</a>
			{/each}
		</Gallery>
	</div>
</div>
