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
	'C:\\Users\\Dennis\\Downloads\\artis3747_a_giant_square_mouth_--chaos_10_--personalize_5l47k_b5ebd5ed-2cb0-4e39-9195-e2d8ec6d60f5_0.png';
const char = '口';
const explanation = `
Most Common Meaning: a mouth
	`;
const prompt = 'a giant square mouth';
const type = 'Meaning';
uploadImage(imagePath, char, explanation, prompt, type);
