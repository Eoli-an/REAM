import { uploadImage } from './single_image_upload.js';
import fs from 'fs';
import path from 'path';

async function collectAndUploadImages(directories) {
	for (const directory of directories) {
		const files = fs.readdirSync(directory);
		for (const file of files) {
			if (file.endsWith('.png')) {
				const imagePath = path.join(directory, file);
				try {
					console.log('Uploading image:', imagePath);
					const result = await uploadImage(imagePath);
					console.log('Upload successful:', result);
				} catch (error) {
					console.error('Error during upload:', error);
				}
			}
		}
	}
}

async function main() {
	console.log('Starting image upload');
	const scriptDir = path
		.dirname(new URL(import.meta.url).pathname)
		.split('/')
		.slice(1)
		.join('/');
	const directories = [
		path.join(scriptDir, '..', '..', 'static', 'images'),
		path.join(scriptDir, '..', '..', 'static', 'images2'),
		path.join(scriptDir, '..', '..', 'static', 'images3')
	];

	await collectAndUploadImages(directories);
}

main();
