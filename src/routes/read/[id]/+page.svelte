<script lang="ts">
    import { pinyin } from 'pinyin-pro';
    import type { PageData } from './$types';
    import Pagination from './Pagination.svelte';
    import { onMount } from 'svelte';

    export let data: PageData;

    const text_cut = data.text_cut;
    const pinyin_cut = data.pinyin_cut;
    const sentenceOffsets = data.sentenceOffsets;
    let currentSentenceIndex = data.currentSentenceIndex;

    $: page_words = text_cut.slice(sentenceOffsets[currentSentenceIndex], sentenceOffsets[currentSentenceIndex + 1] || text_cut.length);
    $: page_pinyin = pinyin_cut.slice(sentenceOffsets[currentSentenceIndex], sentenceOffsets[currentSentenceIndex + 1] || text_cut.length);

    function goBack() {
        if (currentSentenceIndex > 0) {
            currentSentenceIndex--;
        }
    }

    function goForward() {
        if (currentSentenceIndex < sentenceOffsets.length - 1) {
            currentSentenceIndex++;
        }
    }

    let simplifyToggle: boolean = false;

    function simplify() {
        simplifyToggle = !simplifyToggle;
    }
</script>

<div class="navigation">
    <button on:click={goBack}>Previous Sentence</button>
    <button on:click={goForward}>Next Sentence</button>
</div>

<div class="content">
    <Pagination words={page_words} pinyin_words={page_pinyin} />
</div>

<style>
    .navigation {
        position: sticky;
        top: 0;
        background-color: white;
        padding: 10px;
        z-index: 100;
    }

    .content {
        margin-top: 20px;
    }
</style>