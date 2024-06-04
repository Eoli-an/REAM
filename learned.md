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

# Fetch
Sveltekit has a special fetch with some additional stuff that can be used in the load function, https://kit.svelte.dev/docs/load#making-fetch-requests

# Dealing with undefined
If a undefined value occurs, i.e. from database this can be used: value || []
The || [] part is the default value. It means that if imagePathsWord is falsy (e.g., null, undefined, 0, '', false, or NaN), then the default value of an empty array [] will be used instead.

# Variable definition in page
Previously I did  i.e. const words = data.words;. This is not reeactive, so even if data.words changes, words stays the same. Rather just use data.words everywhere...(was also problem why images did not update)

# SQL upsert constraint
If I want to have a constraint over multiple cols in supabase, I first have to create a combined unique index