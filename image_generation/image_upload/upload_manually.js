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
	'C:\\Users\\Dennis\\Downloads\\artis3747_person_on_a_walk_through_Japanese_autumn_landscape__6990819f-8bfa-4705-9cf2-6e90e63d5410_2.png';
const char = '走';
const explanation = `
    Most Common Meaning:
    walk
    Thinking of a visual representation:
	A person walking, stlye it a bit
    `;
const prompt =
	'person on a walk through Japanese autumn landscape, tree leaves spells "walk", Denis Villeneuve movie still, digital art';
const type = 'Meaning';
uploadImage(imagePath, char, explanation, prompt, type);
