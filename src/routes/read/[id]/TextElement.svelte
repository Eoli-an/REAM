<script lang="ts">

	// the name is updated whenever the prop value changes...
	export let word: string;
    // export let textSize: number;
    // export let knowledge_level: number;
    // export let pinyin_word: string;
    // export let translation: string;

    function handleClick(ord : string) {
        console.log(`You clicked on ${word}`);
        word = "clicked"
    }

</script>

<span on:click={() => handleClick(word)}>{word}</span>
