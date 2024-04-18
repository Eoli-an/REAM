<script lang="ts">

	// the name is updated whenever the prop value changes...
	export let word: string;
    // export let textSize: number;
    // export let knowledge_level: number;
    export let pinyin_word: string;
    export let translation: string;

    let displayType = 'word'; // Possible values: 'word', 'pinyin', 'translation', 'image'
    let displayText: string;

    function circleThrough() {
        if (displayType === 'word') {
            displayType = 'pinyin';
        } else if (displayType === 'pinyin') {
            displayType = 'translation';
        } else if (displayType === 'translation') {
            displayType = 'word';
        }
    }

    $: {
        if (displayType === 'pinyin') {
            displayText = pinyin_word;
        } else if (displayType === 'translation') {
            displayText = translation;
        } else {
            displayText = word;
        }
    }
</script>

<button on:click={circleThrough}>
    {displayText}
</button>

<style>
    button {
      background-color: transparent; /* Remove the gray background */
      border: 1px solid #ccc; /* Add a light border */
      border-radius: 0; /* Remove the rounded edges */
      padding: 8px 16px; /* Adjust the padding as needed */
      font-size: 16px; /* Adjust the font size as needed */
      cursor: pointer; /* Add a pointer cursor on hover */
    }
  </style>