<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
</script>

<h1>{$page.status}: {$page.error?.message}</h1>
<p>Error uploading text. Please try again.</p>

<button on:click={() => goto('/app/upload')} class="mt-4 rounded bg-blue-500 px-4 py-2 text-white">
	Back
</button>
