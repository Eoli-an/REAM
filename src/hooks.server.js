import { loadDict } from '@node-rs/jieba';
import fs from 'fs';
import path from 'path';

const staticDir = 'static/dict.txt.big'; // Change this to your static directory name
const staticPath = path.join(process.cwd(), staticDir);

// This will only run once when the app starts, exactly what I want I think because jieba can only be loaded once
// https://stackoverflow.com/a/76505892
// (Problem was previously also that jieba.cut also calls init)
//TODO this stilll doesn't work sometimes

try {
	loadDict(fs.readFileSync(staticPath));
} catch (err) {
	console.error('Error loading dictionary:', err);
}

// initialize directly, otherwiese long cold start
// @ts-ignore
import * as hanzi from 'hanzi';
hanzi.start();

// try {
//     loadDict(fs.readFileSync(staticPath))
// }
// catch (err) {
//     console.log(err);
// }

export async function handle({ event, resolve }) {
	return await resolve(event);
}
