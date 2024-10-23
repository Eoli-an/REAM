<script lang="ts">
	import { onMount } from 'svelte';
	import { wordKnowledge, CharacterKnowledge } from '$lib/stores';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { preloadCode, preloadData } from '$app/navigation';
	import { BottomNav, BottomNavItem, Tooltip } from 'flowbite-svelte';
	import { AngleLeftOutline, AngleRightOutline, HomeOutline } from 'flowbite-svelte-icons';
	import type { LayoutData } from './$types';

	export let data: LayoutData;

	$: ({ supabase } = data);

	const sentenceOffsets = data.sentenceOffsets;
	const wordKnowledgeData = data.wordKnowledgeData;
	const charKnowledgeData = data.characterKnowledgeData;
	const currentId = data.currentId;
	let currentSentenceIndex = data.currentSentenceIndex;
	let sentenceAmount = data.sentenceAmount;

	wordKnowledgeData?.forEach((item: any) => {
		wordKnowledge.update((knowledge) => {
			knowledge[item.wordChinese] = item.knowledgeLevel;
			return knowledge;
		});
	});

	charKnowledgeData?.forEach((item: any) => {
		CharacterKnowledge.update((knowledge) => {
			knowledge[item.character] = item.knowledgeLevel;
			return knowledge;
		});
	});

	async function updateDatabaseSentenceIndex(
		sentenceIndex: number,
		text_id: string,
		supabase: any
	) {
		if (!text_id) {
			console.error('No text_id provided');
			return;
		}

		// First, update TextsMetadata as before
		const { error: metadataError } = await supabase
			.from('TextsMetadata')
			.update({ currentSentence: sentenceIndex })
			.eq('text_id', text_id);

		if (metadataError) {
			console.error('Error updating TextsMetadata:', metadataError);
		}

		// If this is the special text_id, also update PublicTextUserProgress
		if (text_id === '8b43b473-ada8-432a-a3ee-c7954728b720') {
			const {
				data: { user },
				error: userError
			} = await supabase.auth.getUser();

			if (userError) {
				console.error('Error getting user:', userError);
				return;
			}

			if (user?.id) {
				const { error: progressError } = await supabase.from('PublicTextUserProgress').upsert(
					{
						user_id: user.id,
						text_id: text_id,
						currentSentence: sentenceIndex
					},
					{
						onConflict: 'user_id,text_id'
					}
				);

				if (progressError) {
					console.error('Error updating PublicTextUserProgress:', progressError);
				}
			}
		}
	}

	function goBack() {
		if (currentSentenceIndex > 0) {
			currentSentenceIndex--;
			if (currentId) {
				updateDatabaseSentenceIndex(currentSentenceIndex, currentId, supabase);
			}
			goto(`/app/read/${currentId}/${currentSentenceIndex}`);
		}
	}

	function goForward() {
		if (currentSentenceIndex < sentenceAmount - 1) {
			currentSentenceIndex++;
			if (currentId) {
				updateDatabaseSentenceIndex(currentSentenceIndex, currentId, supabase);
			}
			goto(`/app/read/${currentId}/${currentSentenceIndex}`);
		}
	}

	if (browser) {
		goto(`/app/read/${currentId}/${currentSentenceIndex}`);
	}
</script>

<div class="flex min-h-screen flex-col">
	<main class="flex-grow pb-16">
		<slot></slot>
	</main>

	<BottomNav position="fixed" navType="pagination" classInner="grid-cols-3">
		<BottomNavItem btnName="Previous Sentence" on:click={goBack}>
			<AngleLeftOutline
				class="mb-1 h-6 w-6 text-gray-500 group-hover:text-primary-600 dark:text-gray-400 dark:group-hover:text-primary-500"
			/>
		</BottomNavItem>
		<BottomNavItem btnName="Home" href="/app/upload">
			<HomeOutline
				class="mb-1 h-6 w-6 text-gray-500 group-hover:text-primary-600 dark:text-gray-400 dark:group-hover:text-primary-500"
			/>
		</BottomNavItem>
		<BottomNavItem btnName="Next Sentence" on:click={goForward}>
			<AngleRightOutline
				class="mb-1 h-6 w-6 text-gray-500 group-hover:text-primary-600 dark:text-gray-400 dark:group-hover:text-primary-500"
			/>
		</BottomNavItem>
	</BottomNav>
</div>
