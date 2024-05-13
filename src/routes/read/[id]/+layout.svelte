<script lang="ts">
    import type { LayoutData } from './$types';
    
    export let data: LayoutData;
    let isDarkMode = false; // Theme state

    function toggleTheme() {
        isDarkMode = !isDarkMode;
        document.body.classList.toggle('dark-mode', isDarkMode);
    }
    //<button on:click={toggleTheme}>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</button> <!-- Toggle theme button -->
</script>



<style>
    /* Dark mode styles */
    :global(body.dark-mode) {
        background-color: #333;
        color: #fff;
    }
</style>

<slot />