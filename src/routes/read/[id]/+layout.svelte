<script lang="ts">
    import { onMount } from 'svelte';

    onMount(() => {
        document.documentElement.setAttribute('data-theme', 'dark');
    });
</script>

<slot></slot>

<style>
    :global([data-theme='dark']) {
        --background-color: black;
        --text-color: #ffffff;
        --button-background: #333333;
        --button-text: #ffffff;
    }

    :global(body) {
        background-color: var(--background-color);
        color: var(--text-color);
    }

    :global(button) {
        background-color: var(--button-background);
        color: var(--button-text);
    }
</style>