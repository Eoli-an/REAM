import Groq from 'groq-sdk';
const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});


async function translateWord(text: string, words: string[]) {
    const chatInput = text + '\n\n-' + words.join('\n-');
    const systemPrompt = `You will be given a piece of chinese text and then a list of words from this chinese text. Generate word-by-word translations, that are context appropriate. Be brief with the translations.
    Do NOT output anything else. Adhere strcitly to the format of the example output. JUST DO THE TASK.
  
  For instance the input could be:
  哈利波特站在火車站的月台上，心情既興奮又緊張。他即將乘坐霍格華茲特快列車，前往他夢寐以求的魔法學校。
  
  -月台
  -即將
  -前往
  
  Then the output should be:
  
  -月台: platform
  -即將: soon 
  -前往: go`;
  
    const chatCompletion = await groq.chat.completions.create({
      model: 'gemma-7b-it',
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        {
          role: 'user',
          content: chatInput,
        },
      ],
      temperature: 1,
      max_tokens: 5000,//chatInput.length * 5,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      //stream: true,
    });
  
    const content = chatCompletion.choices[0].message.content;
    if (!content) {
      throw new Error('No content in chatCompletion');
    }
    console.log("CONTENT: ", chatInput);
    console.log("RESPONSE: ", content);
  
    const outputList: string[] = [];
    for (const line of content.split('\n')) {
      const translation = line.split(': ')[1].split('/')[0].split('(')[0].replace("'", "").trim();
      outputList.push(translation);
    }
    return outputList;
}

export { translateWord };