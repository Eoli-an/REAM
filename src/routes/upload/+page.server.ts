import type { PageServerLoad } from './$types';
import { supabase } from '$lib/supabaseClient';


export const load = (async ({fetch}) => {
//     const text = `家住女貞路4號的德思禮夫婦總是得意地說他們是非常規矩的人家，拜託 ，拜託了。他們從來跟神祕古怪的事不沾邊，因爲他們根本不相信那些邪門歪道。
// 弗農·德思禮先生在一家名叫格朗寧的公司做主管，公司生產鑽機。他高大魁梧，胖得幾乎連脖子都沒有了，卻蓄着一臉大鬍子。德思禮太太是一個瘦削的金髮女人。`;
    
//     fetch('/api/process', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({ text: text })
//     })

    const { data, error } = await supabase
        .from('Texts')
        .select('book_id');

    if (error) {
        console.error('Error fetching book IDs:', error);
        return { texts: [] };
    }


    return { texts: data };
}) satisfies PageServerLoad;