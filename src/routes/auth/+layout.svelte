<script lang="ts">
	import type { LayoutData } from './$types';

	export let data: LayoutData;
</script>

<header>
	<nav>
		<a href="/" class="flex items-center">
			<img
				src="https://kxkuuxexzztnyzzmptgg.supabase.co/storage/v1/object/public/Images/Website/a_sleek_and_modern_logo_for_the_app_ream_featuring_wQoP4cC5TGKm8BNXWM4vGg_jiMwf6ZbS0yL_iyeBuWfog.png"
				class="mr-3 h-24"
				alt="REAM Logo"
			/>
		</a>
	</nav>
</header>
<slot />
