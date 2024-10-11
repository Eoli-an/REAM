import * as fal from '@fal-ai/serverless-client';
import OpenAI from 'openai';
import fetch from 'node-fetch';
import { v4 as uuidv4 } from 'uuid';
import { createClient } from '@supabase/supabase-js';
import { decode } from 'base64-arraybuffer';
import fs from 'fs/promises';
import * as hanzi from 'hanzi';
import pkg from 'chinese-s2t';
const { s2t } = pkg;

fal.config({
	credentials: '7be3be56-3700-4234-9203-ef6157342e32:0721b7a7f8ab9cbf2949f92760f8ac0c'
});

// Initialize hanzi
hanzi.start();

// Initialize Supabase client
const supabase = createClient(
	'https://kxkuuxexzztnyzzmptgg.supabase.co',
	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt4a3V1eGV4enp0bnl6em1wdGdnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTU4NTE5MTksImV4cCI6MjAzMTQyNzkxOX0.N77BjJm27qvDNNPbMrzL7CeiubOGTE0xCeaROXAxFnU'
);

// Initialize OpenAI client
const openai = new OpenAI({
	baseURL: 'https://openrouter.ai/api/v1',
	apiKey: process.env.OPENROUTER_API_KEY,
	defaultHeaders: {}
});

// Function to decompose character
function decomposeCharacter(char) {
	const decomposition = hanzi.decompose(char, 1);
	console.log(
		`Decomposing character: ${char}, components: ${JSON.stringify(decomposition.components)}`
	); // {{ edit_1 }}
	return decomposition.components ? decomposition.components : [];
}

// Function to get animal and verb from JSON
async function getAnimalAndVerb(component) {
	console.log(`Fetching animal and verb for component: ${component}`); // {{ edit_2 }}
	const jsonContent = await fs.readFile(
		'image_generation/mnemonics/level1_components_associations.json',
		'utf8'
	);
	const associations = JSON.parse(jsonContent);
	return associations[component] || { animal: 'Unknown', verb1: 'Unknown', location: 'Unknown' };
}

// Function to generate prompt using LLM
async function generatePrompt(animal, location) {
	console.log(`Generating prompt for animal: ${animal}, location: ${location}`); // {{ edit_3 }}
	const chatCompletion = await openai.chat.completions.create({
		model: 'meta-llama/llama-3.1-70b-instruct',
		messages: [
			{
				role: 'system',
				content: `Generate a vivid and concise image prompt based on an animal at a location. This should be a very memorable image prompt.
                so make it funny, interesting, unusal etc, think about what the animal would do at that location. It should be very specific
                to that location and animal, such that if for instance a different animal was at that location, the stories would be very different.
                if the location is unnown, just return the animal prompt, if the animal is unknown, just return the location prompt.
                 Only return the prompt, nothing else, I will
                    directly parse it`
			},
			{
				role: 'user',
				content: `Create an image prompt for a ${animal} at location ${location}.`
			}
		],
		temperature: 0.7
	});

	return chatCompletion.choices[0].message.content.trim();
}

// Function to generate image using FAL AI
async function generateImage(prompt) {
	console.log(`Generating image with prompt: ${prompt}`); // {{ edit_4 }}
	const result = await fal.subscribe('fal-ai/flux/schnell', {
		input: {
			prompt: prompt,
			image_size: 'square',
			num_images: 1
		}
	});

	return result.images[0].url;
}

// Function to upload image to Supabase
async function uploadImage(imageUrl, char, prompt) {
	console.log(`Uploading image for character: ${char}, prompt: ${prompt}`); // {{ edit_5 }}
	const id = uuidv4();
	const response = await fetch(imageUrl);
	const arrayBuffer = await response.arrayBuffer();

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
		.insert([{ id, char, index, prompt, type: 'Mnemonic' }]);

	if (newImageError) {
		throw new Error(`Error inserting image data: ${newImageError.message}`);
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

	return { newImageData, uploadData };
}

// Main function to process characters
async function processCharacters(characters) {
	for (const char of characters) {
		try {
			console.log(`Processing character: ${char}`); // {{ edit_6 }}
			const traditionalChar = s2t(char);
			const components = decomposeCharacter(char);

			if (components.length >= 2) {
				const { animal } = await getAnimalAndVerb(components[0]);
				// const { verb1: verb } = await getAnimalAndVerb(components[1]);
				const { location } = await getAnimalAndVerb(components[1]);

				const prompt = await generatePrompt(animal, location);
				const imageUrl = await generateImage(prompt);
				await uploadImage(imageUrl, traditionalChar, prompt);

				console.log(`Processed character: ${char}`); // {{ edit_7 }}
			} else {
				console.log(`Skipping character ${char} due to insufficient components`); // {{ edit_8 }}
			}
		} catch (error) {
			console.error(`Error processing character ${char}:`, error);
		}
	}
}

// Read characters from file and start processing
async function main() {
	try {
		// const charactersContent = await fs.readFile('characters.json', 'utf8');
		// const characters = JSON.parse(charactersContent);
		// const characters = ['兔', '赛', '跑', '子', '和', '乌', '在'];
		const characters = ['龟'];
		await processCharacters(characters);
	} catch (error) {
		console.error('Error in main function:', error);
	}
}

main();
