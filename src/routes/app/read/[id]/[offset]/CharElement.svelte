<script lang="ts">
	import { CharacterKnowledge } from '$lib';
	// @ts-ignore
	import pkg from 'chinese-s2t';
	const { s2t } = pkg;

	export let char: string;
	export let imagePaths;
	export let imageChosen;
	export let supabase: any;

	let chosen_image = 0;
	let imagePath: string;
	let image_available = false;

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
			imagePath = imagePaths[s2t(char)][chosen_image];
		}
	}

	let displayType: string = 'image';

	$: {
		const charKey = s2t(char);
		const knowledgeLevel = $CharacterKnowledge[charKey];
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
		const newKnowledgeLevel = $CharacterKnowledge[charKey] === 0 ? 1 : 0;
		CharacterKnowledge.update((knowledge) => {
			return { ...knowledge, [charKey]: newKnowledgeLevel };
		});
		updateDatabase(charKey, newKnowledgeLevel, chosen_image);
	}
</script>

{#if isChineseCharacter}
	<button
		on:click={circle}
		class="m-0 h-10 w-10 cursor-pointer border-none bg-transparent p-0 text-[40px] sm:w-20 sm:text-[70px]"
	>
		{#if displayType === 'character'}
			{char}
		{:else if image_available}
			<img
				src={imagePath}
				alt={char}
				class="m-0 mt-[10px] h-auto w-[40px] align-middle sm:mt-[20px] sm:w-[70px]"
			/>
		{:else}
			{char}
		{/if}
	</button>
{:else}
	<button
		class="m-0 h-10 w-10 cursor-pointer border-none bg-transparent p-0 text-[40px] sm:w-20 sm:text-[70px]"
	>
		{char}
	</button>
{/if}
