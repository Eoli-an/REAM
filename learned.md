# State on server
Server should be stateless, https://kit.svelte.dev/docs/state-management. Stores don't update between client and server.

# Await in html
If I use await in html I have to wait for the promise in any case. Because if the promise fails and I do not include it in error handling, the program will crash. So each uncaught error will crash the program. Makes sense lol. Was here the case:
'''
<button on:click={circle}>
    {#if displayType === 'character'}
        {char}
    {:else}
        {#await imagePromise}
            ...
        {:then src}
            <img src={src} alt={char}/>
        {:catch error}
            {char}
        {/await}
    {/if}
</button>
'''

# Auto subscriptions
Instead of setting up a subscription to a store, can also be done with reactive statements. See https://dev.to/jdgamble555/the-unwritten-svelte-stores-guide-47la. Then, one also does not have to concern oneself with destroying the subscription, is done automatically.