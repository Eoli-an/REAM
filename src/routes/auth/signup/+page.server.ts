import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit'
import type { Actions } from './$types'

export const load = (async () => {
    return {};
}) satisfies PageServerLoad;


export const actions: Actions = {
  signup: async ({ request, locals: { supabase } }) => {
    const formData = await request.formData()
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) {
      console.error(error)
      redirect(303, '/auth/error')
    } else {
      // Add the standard text to the user's TextsMetadata
      const standardTextId = '8b43b473-ada8-432a-a3ee-c7954728b720'
      const { error: textError } = await supabase
        .from('TextsMetadata')
        .insert({ 
          text_id: standardTextId, 
          user_id: data.user?.id,
          title: 'tortoise_hare'
        })

      if (textError) {
        console.error('Error adding standard text:', textError)
        // You may want to handle this error differently
      }
      
      redirect(303, '/')
    }
  }
}