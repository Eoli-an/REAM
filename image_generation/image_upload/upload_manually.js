import { v4 as uuidv4 } from 'uuid';

import { createClient } from '@supabase/supabase-js';
export const supabase = createClient(
	'https://kxkuuxexzztnyzzmptgg.supabase.co',
	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt4a3V1eGV4enp0bnl6em1wdGdnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTU4NTE5MTksImV4cCI6MjAzMTQyNzkxOX0.N77BjJm27qvDNNPbMrzL7CeiubOGTE0xCeaROXAxFnU'
);

import pkg from 'chinese-s2t';
const { s2t } = pkg;

import fs from 'fs';

async function uploadImage(imagePath, char, explanation, prompt, type) {
	char = s2t(char);
	const id = uuidv4();
	console.log(id);

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

	const imageBuffer = fs.readFileSync(imagePath);
	const { data: uploadData, error: uploadError } = await supabase.storage
		.from('Images')
		.upload(`images/${id}`, imageBuffer, {
			contentType: 'image/png',
			upsert: false
		});
	if (uploadError) {
		throw new Error(`Error uploading image: ${uploadError.message}`);
	}

	return { imageData, uploadData };
}

const imagePath =
	'C:\\Users\\Dennis\\Downloads\\artis3747_A_bustling_market_during_sunset._Skyscrapers_street_f4fdd5c1-9a83-4353-9092-1ed2e4e7c830_1.png';
const char = '市';
const explanation = `
    Most Common Meaning:
    Market, City
    Thinking of a visual representation:
    We can simply show a market in a city to represent this character.
    `;
const prompt =
	'A bustling market during sunset. Skyscrapers, street vendors, and busy pedestrians, middle ages';
const type = 'Meaning';
uploadImage(imagePath, char, explanation, prompt, type);
