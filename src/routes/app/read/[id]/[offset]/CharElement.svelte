<script lang="ts">
	import { CharacterKnowledge } from '$lib';
	import { goto } from '$app/navigation';
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
	const store_value = $CharacterKnowledge;

	$: {
		if (!store_value.hasOwnProperty(char)) {
			displayType = 'image';
		} else {
			if (store_value[s2t(char)] === 0) {
				displayType = 'image';
			} else if (store_value[s2t(char)] === 1) {
				displayType = 'character';
			}
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
			.from('MyKnownCharacters') // Adjust the table name as needed
			.upsert(
				{ character, knowledgeLevel, chosen_image, user_id: userData.user?.id },
				{ onConflict: ['character', 'user_id'] }
			);

		if (error) {
			console.error('Error updating database:', error);
		}
	}

	function circle() {
		if (displayType === 'character') {
			displayType = 'image';
			CharacterKnowledge.update((knowledge) => {
				knowledge[s2t(char)] = 0;
				return knowledge;
			});
			updateDatabase(s2t(char), 0, chosen_image);
		} else if (displayType === 'image') {
			displayType = 'character';
			CharacterKnowledge.update((knowledge) => {
				knowledge[s2t(char)] = 1;
				return knowledge;
			});
			updateDatabase(s2t(char), 1, chosen_image);
		}
	}
</script>

{#if isChineseCharacter}
	<button
		on:click={circle}
		class=" m-0 m-0 h-10 w-10 cursor-pointer border-none bg-transparent p-0 text-[40px] sm:w-20 sm:w-20 sm:text-[70px]"
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
		class=" m-0 m-0 h-10 w-10 cursor-pointer border-none bg-transparent p-0 text-[40px] sm:w-20 sm:w-20 sm:text-[70px]"
	>
		{char}
	</button>
{/if}

<!-- <button on:click={() => goto(`/dictionaryChar/${char}`)}> -->

<!-- <style>
	button {
		width: 80px; /* Set the desired fixed width */
		height: 80px; /* Set the desired fixed height */
		background-color: transparent;
		border: none;
		/* border-radius: 0; */
		/* padding: 4px 8px; */
		font-size: 60px;
		cursor: pointer;
		margin-right: 0px;
		margin-bottom: 0px;
		margin-top: 0px;
		margin-left: 0px;
		padding: 0px;
		font-size: 70px;
	}

	img {
		width: 70px;
		height: auto;
		vertical-align: middle;
		margin-right: 0px;
		margin-bottom: 0px;
		margin-top: 20px;
	}
</style> -->
