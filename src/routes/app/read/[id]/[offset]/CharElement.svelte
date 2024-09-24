<script lang="ts">
	import { CharacterKnowledge } from '$lib';
	import { Dropdown, DropdownItem } from 'flowbite-svelte';
	import { TwicImg } from '@twicpics/components/sveltekit';
	import { TwicPicture } from '@twicpics/components/sveltekit';
	// @ts-ignore
	import pkg from 'chinese-s2t';
	const { s2t } = pkg;

	export let char: string;
	export let imagePaths;
	export let imageChosen;
	export let supabase: any;
	export let uniqueId: string; // Added uniqueId as a prop for unique dropdown triggers

	let chosen_image = 0;
	let imagePath: string;
	let image_available = false;
	let dropdownOpen = false; // Added state to control dropdown

	$: isChineseCharacter = /^[\u4e00-\u9fa5]$/.test(char);

	$: {
		chosen_image = 0;
		if (imageChosen.hasOwnProperty(s2t(char))) {
			chosen_image = imageChosen[s2t(char)];
		}
	}

	$: {
		image_available = false;
		if (imagePaths.hasOwnProperty(s2t(char))) {
			image_available = true;
			// imagePath = imagePaths[s2t(char)][chosen_image];
			const imageName = imagePaths[s2t(char)][chosen_image].split('/').pop();
			imagePath = imageName;
			// imagePath = `https://reamimages.twic.pics/${imageName}`;
		}
	}

	let displayType: string = 'image';

	$: {
		const charKey = s2t(char);
		const knowledgeLevel = $CharacterKnowledge[charKey] ?? 0; // Default to 0 if undefined
		if (knowledgeLevel === 1) {
			displayType = 'character';
		} else {
			displayType = 'image';
		}
	}

	async function updateDatabase(character: string, knowledgeLevel: number, chosen_image: number) {
		const { data: userData, error: userError } = await supabase.auth.getUser();

		if (userError) {
			console.error('Error fetching user data:', userError);
			return {
				success: false,
				message: 'Error fetching user data.'
			};
		}
		const { error } = await supabase
			.from('MyKnownCharacters')
			.upsert(
				{ character, knowledgeLevel, chosen_image, user_id: userData.user?.id },
				{ onConflict: ['character', 'user_id'] }
			);

		if (error) {
			console.error('Error updating database:', error);
		}
	}

	function circle() {
		const charKey = s2t(char);
		const currentLevel = $CharacterKnowledge[charKey] ?? 0; // Default to 0 if undefined
		const newKnowledgeLevel = currentLevel === 0 ? 1 : 0;
		CharacterKnowledge.update((knowledge) => {
			return { ...knowledge, [charKey]: newKnowledgeLevel };
		});
		updateDatabase(charKey, newKnowledgeLevel, chosen_image);
		dropdownOpen = false; // Close the dropdown after toggling
	}
</script>

{#if isChineseCharacter}
	<div class="relative inline-block">
		<!-- Dropdown Trigger -->
		<Dropdown
			placement="top"
			triggeredBy={`#char-dropdown-${uniqueId}-${char}`}
			bind:open={dropdownOpen}
		>
			<DropdownItem on:click={circle}>Switch</DropdownItem>
			<DropdownItem href={`/app/dictionaryChar/${char}`}>Explanation</DropdownItem>
		</Dropdown>

		<!-- Button that triggers the Dropdown -->
		<button
			id={`char-dropdown-${uniqueId}-${char}`}
			class="m-0 h-10 w-10 cursor-pointer border-none bg-transparent p-0 text-[40px] sm:w-20 sm:text-[70px]"
		>
			{#if displayType === 'character'}
				{char}
			{:else if image_available}
				<TwicPicture
					src={imagePath}
					alt={char}
					preTransform="contain=100x100/quality=10/cover=100x100"
					mode="contain"
					eager="true"
					sizes="10pxx10px"
					class="m-0 mt-[10px] h-auto w-[40px] align-middle sm:mt-[20px] sm:w-[70px]"
				/>
			{:else}
				{char}
			{/if}
		</button>
	</div>
{:else}
	<button
		class="m-0 h-10 w-10 cursor-pointer border-none bg-transparent p-0 text-[40px] sm:w-20 sm:text-[70px]"
	>
		{char}
	</button>
{/if}
