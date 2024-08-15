<script lang="ts">
	import type { LayoutData } from './$types';

	export let data: LayoutData;
	$: ({ supabase } = data);
</script>

<!-- <header>
	<nav>
		<a href="/">Home</a>
	</nav>
	<button on:click={logout}>Logout</button>
</header> -->
<main>
	<slot />
</main>
