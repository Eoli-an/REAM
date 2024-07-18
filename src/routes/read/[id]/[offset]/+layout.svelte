<script lang="ts">
	import type { LayoutData } from './$types';

	export let data: LayoutData;

	import { setContext } from 'svelte';
	import { writable } from 'svelte/store';

	const simplified = writable(false);
	setContext('simplified', simplified);
</script>

<slot></slot>
