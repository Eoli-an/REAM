<script lang="ts">
	import type { PageData } from './$types';
	import { Section, Register } from 'flowbite-svelte-blocks';
	import { Button, Checkbox, Label, Input } from 'flowbite-svelte';

	export let data: PageData;
</script>

<Section name="register">
	<div class="space-y-4 p-6 sm:p-8 md:space-y-6">
		<form method="POST" action="?/signup" class="flex flex-col space-y-6">
			<h3 class="p-0 text-xl font-medium text-gray-900 dark:text-white">Create an account</h3>
			<Label class="space-y-2">
				<span>Your email</span>
				<Input type="email" name="email" placeholder="name@company.com" required />
			</Label>
			<Label class="space-y-2">
				<span>Your password</span>
				<Input type="password" name="password" placeholder="•••••" required />
			</Label>
			<Label class="space-y-2">
				<span>Confirm password</span>
				<Input type="password" name="confirm-password" placeholder="•••••" required />
			</Label>
			<div class="flex items-start">
				<Checkbox
					>I accept the <a
						class="font-medium text-primary-600 hover:underline dark:text-primary-500"
						href="/"
					>
						Terms and Conditions</a
					></Checkbox
				>
			</div>
			<Button type="submit" class="w-full">Create an account</Button>
			<div class="text-sm font-medium text-gray-500 dark:text-gray-300">
				Already have an account? <a
					href="?/login"
					class="font-medium text-primary-600 hover:underline dark:text-primary-500">Login here</a
				>
			</div>
		</form>
	</div>
</Section>
