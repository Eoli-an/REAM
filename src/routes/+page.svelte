<script lang="ts">
	import { Button, Navbar, NavBrand, NavLi, NavUl, NavHamburger } from 'flowbite-svelte';

	let navClass = 'bg-white border-gray-200 px-4 lg:px-6 py-2.5 dark:bg-gray-800';
	let navDivClass = 'flex flex-wrap justify-between items-center mx-auto max-w-screen-xl';
</script>

<header>
	<Navbar let:hidden let:toggle fluid={false} {navClass} {navDivClass}>
		<NavBrand href="/">
			<img
				src="https://kxkuuxexzztnyzzmptgg.supabase.co/storage/v1/object/public/Images/Website/a_sleek_and_modern_logo_for_the_app_ream_featuring_wQoP4cC5TGKm8BNXWM4vGg_jiMwf6ZbS0yL_iyeBuWfog.png"
				class="h-20"
				alt="REAM Logo"
			/>
			<!-- <span class="self-center whitespace-nowrap text-xl font-semibold dark:text-white">REAM</span> -->
		</NavBrand>
		<div class="flex items-center lg:order-2">
			<Button href="/upload" color="dark">Log in</Button>
			<Button class="ml-2 bg-blue-900 text-white" href="/upload">Get started</Button>
			<NavHamburger
				on:click={toggle}
				btnClass="inline-flex items-center p-2 ml-1 text-sm text-gray-500 rounded-lg lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
			/>
		</div>
		<NavUl
			{hidden}
			divClass="justify-between items-center w-full lg:flex lg:w-auto lg:order-1"
			ulClass="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0"
		>
			<NavLi href="/" active={true}>Home</NavLi>
			<NavLi href="/">About</NavLi>
			<NavLi href="/">Blog</NavLi>
		</NavUl>
	</Navbar>
</header>

<main class="pt-16">
	<!-- Hero Section -->
	<section class="bg-white dark:bg-gray-900">
		<div class="mx-auto grid max-w-screen-xl px-4 py-8 lg:grid-cols-12 lg:gap-8 lg:py-16 xl:gap-0">
			<div class="mr-auto place-self-center lg:col-span-7">
				<h1
					class="mb-4 max-w-2xl text-4xl font-extrabold leading-none tracking-tight md:text-5xl xl:text-6xl dark:text-white"
				>
					Reading Chinese Streamlined
				</h1>
				<p
					class="mb-6 max-w-2xl font-light text-gray-500 md:text-lg lg:mb-8 lg:text-xl dark:text-gray-400"
				>
					REAM helps you read your favorite texts in Chinese, even if they are above your current
					level. We use modern AI to make your texts more comprehensible and enjoyable.
				</p>
				<!-- <Button size="xl" color="red">Try For Free <ArrowRight class="ml-2 h-5 w-5" /></Button> -->
				<Button class="bg-blue-900 text-white" size="xl" href="/upload">Try it</Button>
			</div>
			<div class="hidden lg:col-span-5 lg:mt-0 lg:flex">
				<img
					src="https://kxkuuxexzztnyzzmptgg.supabase.co/storage/v1/object/public/Images/Website/artis3747_Chinese_character_for_fire___personalize_dtyftfs____f4cbe91f_855b_4bc3_a247_f1bb1724969c_1.png"
					alt="mockup"
				/>
			</div>
		</div>
	</section>

	<!-- Feature Section 1 -->
	<section class="bg-gray-50 dark:bg-gray-800">
		<div class="mx-auto max-w-screen-xl px-4 py-8 sm:py-16 lg:px-6">
			<div class="mb-8 max-w-screen-md lg:mb-16">
				<h2 class="mb-4 text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">
					AI-Powered Simplification
				</h2>
				<p class="text-gray-500 sm:text-xl dark:text-gray-400">
					REAM uses large language models to simplify complex Chinese texts into a more digestible
					form
				</p>
			</div>
			<div class="space-y-8 md:grid md:grid-cols-2 md:gap-12 md:space-y-0 lg:grid-cols-3">
				<div>
					<h3 class="mb-2 text-xl font-bold dark:text-white">Less Complex Grammar</h3>
					<p class="text-gray-500 dark:text-gray-400">
						Adapt the text to your personal HSK level grammar.
					</p>
				</div>
				<div>
					<h3 class="mb-2 text-xl font-bold dark:text-white">More Common Characters And Words</h3>
					<p class="text-gray-500 dark:text-gray-400">
						Replace rare characters with more common ones to improve readability.
					</p>
				</div>
				<div>
					<h3 class="mb-2 text-xl font-bold dark:text-white">Additional Explanations</h3>
					<p class="text-gray-500 dark:text-gray-400">
						Provide explanations for difficult words and phrases to aid comprehension.
					</p>
				</div>
			</div>
		</div>
	</section>

	<!-- Feature Section 2 -->
	<section class="bg-white dark:bg-gray-900">
		<div class="mx-auto max-w-screen-xl px-4 py-8 sm:py-16 lg:px-6">
			<div class="mb-8 max-w-screen-md lg:mb-16">
				<h2 class="mb-4 text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">
					Adaptive Translation
				</h2>
				<p class="text-gray-500 sm:text-xl dark:text-gray-400">
					REAM provides you with translations, right where you need them
				</p>
			</div>
			<div class="space-y-8 md:grid md:grid-cols-2 md:gap-12 md:space-y-0 lg:grid-cols-3">
				<div>
					<h3 class="mb-2 text-xl font-bold dark:text-white">Sentence Translation</h3>
					<p class="text-gray-500 dark:text-gray-400">
						Don't quite get the meaning of a sentence? REAM is here to help.
					</p>
				</div>
				<div>
					<h3 class="mb-2 text-xl font-bold dark:text-white">Word Translation</h3>
					<p class="text-gray-500 dark:text-gray-400">
						Adaptively translate words that you don't want to learn right now
					</p>
				</div>
				<div>
					<h3 class="mb-2 text-xl font-bold dark:text-white">AI-powered</h3>
					<p class="text-gray-500 dark:text-gray-400">
						Chinese words can have many meanings. REAM gives you the right one for the context.
					</p>
				</div>
			</div>
		</div>
	</section>

	<!-- Feature Section 1 -->
	<section class="bg-gray-50 dark:bg-gray-800">
		<div class="mx-auto max-w-screen-xl px-4 py-8 sm:py-16 lg:px-6">
			<div class="mb-8 max-w-screen-md lg:mb-16">
				<h2 class="mb-4 text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">
					Mnemonics make your life easier
				</h2>
				<p class="text-gray-500 sm:text-xl dark:text-gray-400">
					In REAM we have create powerful Mnemonics for each character. This makes learning new
					characters a breeze.
				</p>
			</div>
			<div class="space-y-8 md:grid md:grid-cols-2 md:gap-12 md:space-y-0 lg:grid-cols-3">
				<div>
					<h3 class="mb-2 text-xl font-bold dark:text-white">AI-generated Images</h3>
					<p class="text-gray-500 dark:text-gray-400">
						AI helps to visualize even the most absurd Mnemonics.
					</p>
				</div>
				<div>
					<h3 class="mb-2 text-xl font-bold dark:text-white">Adaptive Scaffolding</h3>
					<p class="text-gray-500 dark:text-gray-400">
						REAM provides a multiple Mnemonics per image, so you can learn step by step.
					</p>
				</div>
				<div>
					<h3 class="mb-2 text-xl font-bold dark:text-white">Choose Your Style</h3>
					<p class="text-gray-500 dark:text-gray-400">
						Choose between different types of Mnemonics to find the one that suits you best.
					</p>
				</div>
			</div>
		</div>
	</section>

	<!-- CTA Section -->
	<section class="bg-white dark:bg-gray-900">
		<div class="mx-auto max-w-screen-xl px-4 py-8 sm:py-16 lg:px-6">
			<div class="mx-auto max-w-screen-sm text-center">
				<h2 class="mb-4 text-4xl font-extrabold leading-tight text-gray-900 dark:text-white">
					Start your Chinese learning journey today
				</h2>
				<p class="mb-6 font-light text-gray-500 md:text-lg dark:text-gray-400">
					Try REAM and experience the power of AI-assisted language learning.
				</p>
				<Button class="bg-blue-900 text-white" size="xl" href="/upload">Get started</Button>
			</div>
		</div>
	</section>
</main>

<footer class="bg-gray-50 dark:bg-gray-800">
	<div class="mx-auto max-w-screen-xl">
		<div class="md:flex md:justify-between">
			<div class="mb-6 md:mb-0">
				<a href="/" class="flex items-center">
					<img src="https://flowbite.com/docs/images/logo.svg" class="mr-3 h-8" alt="REAM Logo" />
					<span class="self-center whitespace-nowrap text-2xl font-semibold dark:text-white"
						>REAM</span
					>
				</a>
			</div>
			<div class="grid grid-cols-2 gap-8 sm:grid-cols-3 sm:gap-6">
				<div>
					<h2 class="mb-6 text-sm font-semibold uppercase text-gray-900 dark:text-white">
						Resources
					</h2>
					<ul class="text-gray-600 dark:text-gray-400">
						<li class="mb-4">
							<a href="#" class="hover:underline">Documentation</a>
						</li>
						<li>
							<a href="#" class="hover:underline">Tutorial Videos</a>
						</li>
					</ul>
				</div>
				<div>
					<h2 class="mb-6 text-sm font-semibold uppercase text-gray-900 dark:text-white">
						Follow us
					</h2>
					<ul class="text-gray-600 dark:text-gray-400">
						<li class="mb-4">
							<a href="#" class="hover:underline">Twitter</a>
						</li>
						<li>
							<a href="#" class="hover:underline">Facebook</a>
						</li>
					</ul>
				</div>
				<div>
					<h2 class="mb-6 text-sm font-semibold uppercase text-gray-900 dark:text-white">Legal</h2>
					<ul class="text-gray-600 dark:text-gray-400">
						<li class="mb-4">
							<a href="#" class="hover:underline">Privacy Policy</a>
						</li>
						<li>
							<a href="#" class="hover:underline">Terms &amp; Conditions</a>
						</li>
					</ul>
				</div>
			</div>
		</div>
		<hr class="my-6 border-gray-200 sm:mx-auto lg:my-8 dark:border-gray-700" />
		<div class="sm:flex sm:items-center sm:justify-between">
			<span class="text-sm text-gray-500 sm:text-center dark:text-gray-400"
				>© 2023 <a href="/" class="hover:underline">REAM™</a>. All Rights Reserved.</span
			>
			<div class="mt-4 flex space-x-6 sm:mt-0 sm:justify-center">
				<!-- Add social media icons here -->
			</div>
		</div>
	</div>
</footer>
