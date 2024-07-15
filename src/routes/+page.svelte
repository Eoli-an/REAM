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
			<NavLi href="/">Pricing</NavLi>
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
					Learn Chinese characters with ease
				</h1>
				<p
					class="mb-6 max-w-2xl font-light text-gray-500 md:text-lg lg:mb-8 lg:text-xl dark:text-gray-400"
				>
					REAM is a web app for learning traditional and simplified Chinese characters and
					vocabulary using AI-powered techniques.
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
					AI-Powered Learning
				</h2>
				<p class="text-gray-500 sm:text-xl dark:text-gray-400">
					Our advanced AI algorithms adapt to your learning style, making character recognition and
					memorization more efficient than ever.
				</p>
			</div>
			<div class="space-y-8 md:grid md:grid-cols-2 md:gap-12 md:space-y-0 lg:grid-cols-3">
				<div>
					<h3 class="mb-2 text-xl font-bold dark:text-white">Personalized Learning Path</h3>
					<p class="text-gray-500 dark:text-gray-400">
						Our AI creates a custom learning path based on your progress and goals.
					</p>
				</div>
				<div>
					<h3 class="mb-2 text-xl font-bold dark:text-white">Adaptive Difficulty</h3>
					<p class="text-gray-500 dark:text-gray-400">
						Lessons adjust in real-time to match your skill level for optimal learning.
					</p>
				</div>
				<div>
					<h3 class="mb-2 text-xl font-bold dark:text-white">Smart Review System</h3>
					<p class="text-gray-500 dark:text-gray-400">
						AI-powered spaced repetition ensures you review characters at the perfect intervals.
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
					Comprehensive Learning Experience
				</h2>
				<p class="text-gray-500 sm:text-xl dark:text-gray-400">
					Master Chinese characters from the ground up with our holistic approach to language
					learning.
				</p>
			</div>
			<div class="space-y-8 md:grid md:grid-cols-2 md:gap-12 md:space-y-0 lg:grid-cols-3">
				<div>
					<h3 class="mb-2 text-xl font-bold dark:text-white">Character Breakdown</h3>
					<p class="text-gray-500 dark:text-gray-400">
						Learn the components and radicals that make up each character for better understanding
						and retention.
					</p>
				</div>
				<div>
					<h3 class="mb-2 text-xl font-bold dark:text-white">Contextual Learning</h3>
					<p class="text-gray-500 dark:text-gray-400">
						See characters used in real sentences and dialogues to grasp their practical usage.
					</p>
				</div>
				<div>
					<h3 class="mb-2 text-xl font-bold dark:text-white">Writing Practice</h3>
					<p class="text-gray-500 dark:text-gray-400">
						Perfect your handwriting with our interactive stroke order guides and practice tools.
					</p>
				</div>
			</div>
		</div>
	</section>

	<!-- CTA Section -->
	<section class="bg-gray-50 dark:bg-gray-800">
		<div class="mx-auto max-w-screen-xl px-4 py-8 sm:py-16 lg:px-6">
			<div class="mx-auto max-w-screen-sm text-center">
				<h2 class="mb-4 text-4xl font-extrabold leading-tight text-gray-900 dark:text-white">
					Start your Chinese learning journey today
				</h2>
				<p class="mb-6 font-light text-gray-500 md:text-lg dark:text-gray-400">
					Try REAM for free and experience the power of AI-assisted language learning.
				</p>
				<Button class="bg-blue-900 text-white" size="xl" href="/upload">Get started</Button>
			</div>
		</div>
	</section>
</main>

<footer class="bg-white p-4 sm:p-6 dark:bg-gray-800">
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
