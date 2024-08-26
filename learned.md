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

Previously I did i.e. const words = data.words;. This is not reeactive, so even if data.words changes, words stays the same. Rather just use data.words everywhere...(was also problem why images did not update)

# SQL upsert constraint

If I want to have a constraint over multiple cols in supabase, I first have to create a combined unique index https://stackoverflow.com/questions/75247517/supabase-upsert-multiple-onconflict-constraints

# File upload

File upload with enctype="multipart/form-data", https://www.okupter.com/blog/sveltekit-file-upload

# Command for generating types

npx supabase gen types typescript --project-id "kxkuuxexzztnyzzmptgg" --schema public | Out-File -FilePath temp_database.types.ts -Encoding utf8

> > Copy-Item -Path temp_database.types.ts -Destination src/lib/database.types.ts

# Static dir served automatically in sveltekit

response = await fetch('/short_story.txt'); //SvelteKit automatically serves files from the static directory, so you can directly access the file using its relative path.

# Reading from filesystem

Reading from the filesystem is not encouraged as the build output won't match the desired path as you do in dev. It works in dev because files are left as-is (unbundled) through the dev server. Ideally you should import them, or save it in a database, etc. Marking as duplicate of (https://github.com/sveltejs/kit/issues/5163)

# Passing data between layout and page

Can not be done via probs, instead use context API, which is akin to messsage passing (https://github.com/sveltejs/kit/discussions/10640)

# Reactive declaration in Component

In my CharElement, I had the mental model that for each instance, the variables get set back to the default and a completly new component is created. Now, this is only the case if I wrap everything in a reactive component. The declarations (chosen_image, image_available) however were not reactive. Thus, if before the was an image availbe but afterwards not, the reactive if statements were not triggered and the image paths and chosen images were still those of the last page.

# Depends and invalidate

In sveltekit, a load function can depend on a key (or url). When invalidate(key) is called, the load function that depends on that is rerun

# Case-sensitivity in SQL

SQL is case-sensitive with identifiers, including table names, when they are quoted. However, if you don't quote the table name, PostgreSQL (which Supabase uses) converts it to lowercase by default.

# JWT and Session

A token used to communicate between server and client. When the client logs in, a jwt is created (a session). This JWT is returned to the user. The user can then use the JWT to make further requests to the server. The server can then, using the JWT, verfiy the identity and give information to the User. See https://www.vaadata.com/blog/jwt-tokens-and-security-working-principles-and-use-cases/ and https://supabase.com/docs/guides/auth/sessions. (Traditionally user sessions were implemented by using a unique string stored in cookies that identified the authorization that the user had on a specific browser. Applications would use this unique string to constantly fetch the attached user information on every API call.)

# Unique constraints supabase

Unique constraints over multiple cols (i.e. combination of colx and coly should be unique) must be done in SQL editior, seems not possible in the dashboard
