<!-- src/lib/Modal.svelte -->
<script>
    export let close;
</script>

<div class="modal" on:click={close}>
    <!-- <div class="modal-content" on:click|stopPropagation> -->
        <slot></slot>
</div>

<style>
    .modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
    }

    /* .modal-content {
        background: grey;
        padding: 20px;
        border-radius: 5px;
        max-width: 90%;
        max-height: 90%;
        overflow: auto;
    } */
</style>
