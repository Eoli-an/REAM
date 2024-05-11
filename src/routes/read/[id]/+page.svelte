<script lang="ts">
    import { pinyin } from 'pinyin-pro';
    import type { PageData } from './$types';
    import Pagination from './Pagination.svelte';

    export let data: PageData;

    const text = data.text;
    const known_words = data.knownWords;
    const text_cut = data.text_cut;
    const pinyin_cut = data.pinyin_cut;
    let offset = data.offset;
    let word_amount = 0;

    $: {
        // Calculate the number of words per page, ensuring it's always one sentence
        let currentOffset = offset;
        while (currentOffset < text_cut.length && !['。', '！', '？'].includes(text_cut[currentOffset])) {
            currentOffset++;
        }
        word_amount = currentOffset - offset + 1;
    }

    $: page_words = text_cut.slice(offset, offset + word_amount);
    $: page_pinyin = pinyin_cut.slice(offset, offset + word_amount);

    function goBack() {
        if (offset > 0) {
            offset -= word_amount;
        }
    }

    function goForward() {
        if (offset + word_amount < text_cut.length) {
            offset += word_amount;
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
    <button on:click={simplify}>Simplify</button>
</div>

<div class="content">
    <Pagination words={page_words} pinyin_words={page_pinyin} simplifyToggle={simplifyToggle} />
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