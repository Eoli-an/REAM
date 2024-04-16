<script lang="ts">
    import type { PageData } from './$types';
    import TextElement from './TextElement.svelte';
    
    export let data: PageData;
    console.log(`You clicked on `);

</script>


<h1>{'ok'}</h1>
{#each data.text_cut as word}
    <TextElement word = {word} />
{/each}
