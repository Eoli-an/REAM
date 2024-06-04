import type { PageServerLoad } from './$types';

export const load = (async ({fetch}) => {
    const text = `家住女贞路4号的德思礼夫妇总是得意地说他们是非常规矩的人家，拜托 ，拜托了。他们从来跟神秘古怪的事不沾边，因为他们根本不相信那些邪门歪道。
弗农·德思礼先生在一家名叫格朗宁的公司做主管，公司生产钻机。他高大魁梧，胖得几乎连脖子都没有了，却蓄着一脸大胡子。德思礼太太是一个瘦削的金发女人。`;
    
    fetch('/api/process', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text: text })
    })
    return {};
}) satisfies PageServerLoad;