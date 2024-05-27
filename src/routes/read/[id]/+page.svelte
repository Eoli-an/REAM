<script lang="ts">
    import type { PageData } from './$types';
    import Pagination from './Pagination.svelte';
    import { wordKnowledge } from '$lib/stores';
    import {updateDatabaseSentenceIndex} from '$lib';

    export let data: PageData;

    const text_cut = data.text_cut;
    const pinyin_cut = data.pinyin_cut;
    const sentenceOffsets = data.sentenceOffsets;
    const wordKnowledgeData = data.wordKnowledgeData;
    const imagePaths = data.imagePaths;
    let currentSentenceIndex = data.currentSentenceIndex;


    wordKnowledgeData?.forEach(item => {
        wordKnowledge.update(knowledge => {
            knowledge[item.wordChinese] = item.knowledgeLevel;
            return knowledge;
        });
    });

    $: page_words = text_cut.slice(sentenceOffsets[currentSentenceIndex], sentenceOffsets[currentSentenceIndex + 1] || text_cut.length);
    $: page_pinyin = pinyin_cut.slice(sentenceOffsets[currentSentenceIndex], sentenceOffsets[currentSentenceIndex + 1] || text_cut.length);

    function goBack() {
        if (currentSentenceIndex > 0) {
            currentSentenceIndex--;
            updateDatabaseSentenceIndex(currentSentenceIndex);

        }
    }

    function goForward() {
        if (currentSentenceIndex < sentenceOffsets.length - 1) {
            currentSentenceIndex++;
            updateDatabaseSentenceIndex(currentSentenceIndex);
        }
    }

    let simplifyToggle: boolean = false;

    function simplify() {
        simplifyToggle = !simplifyToggle;
    }
</script>



<div class="content">
    <Pagination words={page_words} pinyin_words={page_pinyin} imagePaths={imagePaths}/>
</div>

<div class="navigation">
    <button class="nav-button" on:click={goBack}>Previous Sentence</button>
    <button class="nav-button" on:click={goForward}>Next Sentence</button>
</div>

<style>
    .navigation {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        background-color: var(--background-color);
        padding: 10px;
        display: flex;
        justify-content: space-between;
        z-index: 100;
    }

    .content {
        margin-top: 20px;
    }

    .nav-button {
        background-color: var(--button-background);
        color: var(--button-text);
        border: none;
        border-radius: 4px;
        padding: 4px 8px;
        font-size: 30px;
        cursor: pointer;
        margin-right: 8px;
    }
</style>