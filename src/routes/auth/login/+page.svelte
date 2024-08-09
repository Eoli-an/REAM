<script lang="ts">
	import type { PageData } from './$types';
	import { Section, Register } from 'flowbite-svelte-blocks';
	import { Button, Checkbox, Label, Input } from 'flowbite-svelte';

	export let data: PageData;
</script>

<Section name="login">
	<div class="space-y-4 p-6 sm:p-8 md:space-y-6">
		<form method="POST" action="?/login" class="flex flex-col space-y-6">
			<h3 class="p-0 text-xl font-medium text-gray-900 dark:text-white">Login</h3>
			<Label class="space-y-2">
				<span>Your email</span>
				<Input type="email" name="email" placeholder="name@company.com" required />
			</Label>
			<Label class="space-y-2">
				<span>Your password</span>
				<Input type="password" name="password" placeholder="•••••" required />
			</Label>
			<div class="flex items-start">
				<Checkbox>Remember me</Checkbox>
				<a href="/" class="ml-auto text-sm text-blue-700 hover:underline dark:text-blue-500"
					>Forgot password?</a
				>
			</div>
			<Button type="submit" class="w-full">Login</Button>
			<p class="text-sm font-light text-gray-500 dark:text-gray-400">
				Don’t have an account yet? <a
					href="?/signup"
					class="font-medium text-primary-600 hover:underline dark:text-primary-500">Sign up</a
				>
			</p>
		</form>
	</div>
</Section>
