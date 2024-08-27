import * as fal from '@fal-ai/serverless-client';
import OpenAI from 'openai';
import fetch from 'node-fetch';
import { v4 as uuidv4 } from 'uuid';
import { createClient } from '@supabase/supabase-js';
export const supabase = createClient(
	'https://kxkuuxexzztnyzzmptgg.supabase.co',
	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt4a3V1eGV4enp0bnl6em1wdGdnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTU4NTE5MTksImV4cCI6MjAzMTQyNzkxOX0.N77BjJm27qvDNNPbMrzL7CeiubOGTE0xCeaROXAxFnU'
);
import { decode } from 'base64-arraybuffer';
import fs from 'fs/promises'; // Import the fs module for file system operations
// @ts-ignore
import pkg from 'chinese-s2t';
const { s2t } = pkg;

const use_fal = false;

const openai = new OpenAI({
	baseURL: 'https://openrouter.ai/api/v1',
	apiKey: process.env.OPENROUTER_API_KEY,
	defaultHeaders: {}
});

const parts = [
	{
		text: 'I want you to write prompts to visualize Chinese characters.\n\nYou will get a Chinese character as an input. First, determine the most common meaning of the character/determine the essence of the character.\n\nThen think about how you can visualize this meaning carefully. When looking at the generated image, the meaning should be as obvious as possible.\n\nThen, write a prompt for an image generation model.\n\nI included some examples how to do so. Read and analyze them carefully. Adhere strictly to the output format that I showcase in the examples. I will parse it programmatically so this is important. Do not add anything else.\n\nIf the meaning of the character is straightforward, you can add elaborate styles to the prompt, this will help make it more memorable. But if the meaning is complicated/abstract, do not add styles as this would cause distractions.'
	},
	{ text: '其' },
	{
		text: 'Most Common Meaning: his/her/its/their (possessive pronoun)\n\nThinking: To visualize this character, we need to have a subject that has/owns an object. To further distinguish this, we can have two subjects and two objects, one object belonging to one subject and the other object belonging to the other subject. \n\nPrompt:\nA red and a green cup on a table. Behind the table there is a woman dressed in red and a man dressed in green.'
	},
	{ text: '实' },
	{
		text: 'Most Common Meaning: True, real, actual\n\nThinking: To visualize this character we can contrast something real with something not real.\n\nPrompt:\nA man removing his theater mask from his face'
	},
	{ text: '里' },
	{
		text: 'Most Common Meaning: village\n\nThinking: This can be visualized easily. We can get creative in the image description to make it memorable.\n\nPrompt:\nA chinese village in the mountains. Serene atmosphere, minimal watercolor painting'
	},
	{ text: '说' },
	{
		text: "Most Common Meaning: Speak, say, explain\n\nThinking: To visualize speaking, we can show a speech bubble coming out of someone's mouth.\n\nPrompt:\nA cartoon figure with a big speech bubble"
	}
	// { text: '奥' },
	// {
	// 	text: 'Most Common Meaning: profound, deep, mysterious\n\nThinking: This meaning is abstract. We need to find a visual metaphor that represents "profound" or "mysterious".\n\nPrompt:\nA deep underwater cave with a beam of light shining through the water'
	// },
	// { text: '运' },
	// {
	// 	text: 'Most Common Meaning:  luck, fortune, destiny\n\nThinking:  Luck is an abstract concept. It can be visualized by objects commonly associated with good fortune.\n\nPrompt:\nA hand holding a four-leaf clover. Golden light shining on the clover.'
	// },
	// { text: '会' },
	// {
	// 	text: 'Most Common Meaning: will, be able to\n\nThinking: To visualize someone "being able to" we need to show a difficult action that someone has mastered.\n\nPrompt:\nA person juggling five colorful balls in the air with a confident smile.'
	// },
	// { text: ' ' }
];

const system_prompt = parts.map((part) => part.text).join('\n');

async function getPromptFromGemini(character) {
	//append char to parts
	const chatCompletion = await openai.chat.completions.create({
		// model: 'google/gemini-flash-1.5',
		model: 'meta-llama/llama-3.1-405b-instruct',
		messages: [
			{
				role: 'system',
				content: system_prompt
			},
			{
				role: 'user',
				content: character
			}
		],
		temperature: 1,
		max_tokens: 100,
		top_p: 0.95,
		frequency_penalty: 0,
		presence_penalty: 0
	});

	const content = chatCompletion.choices[0].message.content;

	console.log(content);

	const response_parts = content.split(':');

	const meaning = response_parts[1].split('\n')[0];
	const thinking = response_parts[2].split('\n')[0];
	const prompt = response_parts[3].trim();

	// console.log(meaning);
	// console.log(thinking);
	// console.log(prompt);

	return { meaning, thinking, prompt };
}

async function generateImageFromFalAI(prompt) {
	console.log('Generating image from FAL AI with prompt:', prompt);
	const result = await fal.subscribe('fal-ai/flux/schnell', {
		input: {
			prompt: prompt,
			image_size: 'square',
			num_images: 1
		},
		logs: true
	});
	// console.log('Generated image:', result.images[0]);

	// Assuming the result contains the image URL or data directly
	return result.images[0]; // Adjust based on actual response structure
}

async function generateImageFromWebEndpoint(prompt) {
	console.log('Generating image from web endpoint with prompt:', prompt);
	const response = await fetch(
		'https://eoli-an--stable-diffusion-xl-model-web-inference-dev.modal.run/',
		{
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ prompt: prompt, n_steps: 4 }) // Ensure the payload matches the expected input
		}
	);

	if (!response.ok) {
		throw new Error(`HTTP error! status: ${response.status}`);
	}

	const blob = await response.arrayBuffer(); // Assuming the response is a PNG image
	return blob;
}

async function downloadImage(url) {
	const response = await fetch(url);
	const arrayBuffer = await response.arrayBuffer();
	return arrayBuffer;
}
async function uploadImage(arrayBuffer, char, explanation, prompt, type) {
	const id = uuidv4();
	// console.log(id);

	const { data: imageData, error: imageError } = await supabase
		.from('images')
		.select('index')
		.eq('char', char)
		.order('index', { ascending: false })
		.limit(1);

	let index = 0;
	if (imageData && imageData.length > 0) {
		index = imageData[0].index + 1;
	}

	const { data: newImageData, error: newImageError } = await supabase
		.from('images')
		.insert([{ id, char, index, explanation, prompt, type }]);

	if (imageError) {
		throw new Error(`Error inserting image data: ${imageError.message}`);
	}

	const base64Image = Buffer.from(arrayBuffer).toString('base64');
	const { data: uploadData, error: uploadError } = await supabase.storage
		.from('Images')
		.upload(`images/${id}`, decode(base64Image), {
			contentType: 'image/png',
			upsert: false
		});
	if (uploadError) {
		throw new Error(`Error uploading image: ${uploadError.message}`);
	}

	return { imageData, uploadData };
}

async function processCharacter(character) {
	const { meaning, thinking, prompt } = await getPromptFromGemini(character);
	const explanation = `Most Common meaning: ${meaning}. Thinking of a visual representation: ${thinking}`;

	if (use_fal) {
		const image = await generateImageFromFalAI(prompt);
		const blob = await downloadImage(image.url); // Download the image
		uploadImage(blob, character, explanation, prompt, 'Meaning'); // Assuming image object has a URL property
	} else {
		const blob = await generateImageFromWebEndpoint(prompt); // Use the new function
		uploadImage(blob, character, explanation, prompt, 'Meaning');
	}
}

async function main() {
	try {
		// Read the content of hp3.txt
		const data = await fs.readFile('static/Three People make a Tiger.txt', 'utf8');

		// Use a Set to store unique characters
		const characters = new Set(data);

		console.log('Unique characters:', characters);

		// Process each unique character
		for (const character of characters) {
			try {
				await processCharacter(s2t(character));
			} catch (error) {
				console.error(`Failed to process character ${character}:`, error);
			}
		}
	} catch (error) {
		console.error('Failed to read or process the text file:', error);
	}
}

async function main2() {
	try {
		// Read the content of hp3.txt
		const data = await fs.readFile('static/Olympics.txt', 'utf8');

		// Use a Set to store unique characters
		const characters = new Set(data);

		console.log('Unique characters:', characters);

		// Process each unique character
		for (const character of characters) {
			// Check if the character is a Chinese character
			if (!/^[\u4e00-\u9fa5]$/.test(character)) {
				console.log(`Character ${character} is not a Chinese character, skipping.`);
				continue;
			}

			try {
				// Check if the character is already in the "images" table with a non-null explanation
				const { data: imageData, error: imageError } = await supabase
					.from('images')
					.select('char, explanation') // Include explanation in the select query
					.eq('char', s2t(character));

				if (imageError) {
					throw new Error(`Error checking for character ${character}: ${imageError.message}`);
				}

				// If the character is not found or no entry has a non-null explanation, process it
				const shouldProcess =
					!imageData || imageData.length === 0 || imageData.every((entry) => !entry.explanation);
				if (shouldProcess) {
					console.log(`Processing character ${character}`);
					await processCharacter(s2t(character));
				} else {
					console.log(
						`Character ${character} already processed with a valid explanation, skipping.`
					);
				}
			} catch (error) {
				console.error(`Failed to process character ${character}:`, error);
			}
		}
	} catch (error) {
		console.error('Failed to read or process the text file:', error);
	}
}
// Example usage
// const characters = ['其', '实']; // Add more characters as needed
// // main(characters);

// processCharacter('個');

main2();
