<script lang="ts">
    import type { PageData } from './$types';
    export let data: PageData;
    const word = data.word;
    const imagePaths = data.imagePaths;
</script>

<div class="image-grid">
    <div class="grid-item">
        <h1 style="font-size: 20rem;">{word}</h1>
        <button>Choose this</button>
    </div>
    {#if imagePaths.length > 0}
        {#each imagePaths as imagePath}
            <div class="grid-item">
                <img src={imagePath} alt={word} />
                <button>Choose this</button>
            </div>
        {/each}
    {:else}
        <div class="grid-item">
            <p>No images available for this word.</p>
            <button>Choose this</button>
        </div>
    {/if}
</div>

<style>
    .image-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        grid-gap: 1rem;
    }

    .grid-item {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    .image-grid img {
        width: 50%;
        height: auto;
        object-fit: cover;
    }
</style>