<script lang="ts">
	import type { LayoutData } from './$types';

	export let data: LayoutData;
</script>

<header>
	<nav>
		<a href="/">Home</a>
	</nav>
</header>
<slot />
