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
    const words_per_page = data.words_per_page;

    $: page_words = text_cut.slice(offset, offset + words_per_page);
    $: page_pinyin = pinyin_cut.slice(offset, offset + words_per_page);


    function goBack() {
        if (offset > 0) {
            offset -= words_per_page;
        }
    }

    function goForward() {
        if (offset + words_per_page < text_cut.length) {
            offset += words_per_page;
        }
    }
</script>


<div class="navigation">
    <button on:click={goBack}>Previous Page</button>
    <button on:click={goForward}>Next Page</button>
</div>

<div class="content">
    <Pagination words={page_words} pinyin_words={page_pinyin}/>
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