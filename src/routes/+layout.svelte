<script>
	import '../app.css';
	import { DarkMode } from 'flowbite-svelte';
	import { invalidate } from '$app/navigation';
	import { onMount } from 'svelte';

	export let data;
	$: ({ session, supabase } = data);

	onMount(() => {
		const { data } = supabase.auth.onAuthStateChange((_, newSession) => {
			if (newSession?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth');
			}
		});

		return () => data.subscription.unsubscribe();
	});
</script>

<DarkMode />
<slot></slot>

<style>
	:global(body) {
		@apply bg-white text-gray-900 dark:bg-gray-900 dark:text-white;
	}
</style>
