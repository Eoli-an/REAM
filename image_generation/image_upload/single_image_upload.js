// import { createClient } from '@supabase/supabase-js';
// export const supabase = createClient(
// 	'https://kxkuuxexzztnyzzmptgg.supabase.co',
// 	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt4a3V1eGV4enp0bnl6em1wdGdnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTU4NTE5MTksImV4cCI6MjAzMTQyNzkxOX0.N77BjJm27qvDNNPbMrzL7CeiubOGTE0xCeaROXAxFnU'
// );
// import { v4 as uuidv4 } from 'uuid';
// import fs from 'fs';
// import path from 'path';

// async function uploadImage(imagePath, explanation, prompt, type) {
// 	const parts = imagePath.split('\\');
// 	const fileName = parts[parts.length - 1];
// 	console.log('Uploading image:', fileName);

// 	// Assert that the file name starts with a Chinese character
// 	if (!/^[\u4e00-\u9fa5]/.test(fileName)) {
// 		throw new Error('File name must start with a Chinese character');
// 	}

// 	const char = fileName[0];

// 	const id = uuidv4();

// 	const { data: imageData, error: imageError } = await supabase
// 		.from('images')
// 		.select('index')
// 		.eq('char', char)
// 		.order('index', { ascending: false })
// 		.limit(1);

// 	let index = 0;
// 	if (imageData && imageData.length > 0) {
// 		index = imageData[0].index + 1;
// 	}

// 	const { data: newImageData, error: newImageError } = await supabase
// 		.from('images')
// 		.insert([{ id, char, index, explanation, prompt, type }]);

// 	if (imageError) {
// 		throw new Error(`Error inserting image data: ${imageError.message}`);
// 	}
// 	const imageBuffer = fs.readFileSync(imagePath);
// 	// Upload the image to the "images" bucket in Supabase storage
// 	const { data: uploadData, error: uploadError } = await supabase.storage
// 		.from('Images')
// 		.upload(`images/${id}`, imageBuffer, {
// 			contentType: 'image/png',
// 			upsert: false
// 		});

// 	if (uploadError) {
// 		throw new Error(`Error uploading image: ${uploadError.message}`);
// 	}

// 	return { imageData, uploadData };
// }

// export { uploadImage };

// async function main() {
// 	console.log('Starting image upload');
// 	const imagePath = 'static/images/貓.png';
// 	try {
// 		const result = await uploadImage(imagePath);
// 		console.log('Upload successful:', result);
// 	} catch (error) {
// 		console.error('Error during upload:', error);
// 	}
// }
