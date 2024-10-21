// @ts-ignore
import * as hanzi from 'hanzi';
hanzi.start();
// Import the file system module
import * as fs from 'fs';

const characters = [
	'兔',
	'赛',
	'跑',
	'子',
	'和',
	'乌',
	'在',
	'夏',
	'天',
	'比',
	'步',
	'得',
	'很',
	'快',
	'她',
	'看',
	'见',
	'还',
	'慢',
	'地',
	'走',
	'就',
	'先',
	'树',
	'下',
	'睡',
	'觉',
	'了',
	'虽',
	'然',
	'但',
	'是',
	'他',
	'没',
	'有',
	'停',
	'一',
	'直',
	'醒',
	'的',
	'时',
	'候',
	'已',
	'经',
	'赢',
	'这',
	'个',
	'故',
	'事',
	'告',
	'诉',
	'我',
	'们',
	'不',
	'要',
	'放',
	'弃',
	'坚',
	'持',
	'会',
	'结',
	'果',
	'去',
	'公',
	'园',
	'玩',
	'吧',
	'小',
	'明',
	'红',
	'你',
	'星',
	'期',
	'六',
	'想',
	'儿',
	'吗',
	'学',
	'校',
	'习',
	'哪',
	'里',
	'来',
	'可',
	'以',
	'游',
	'泳',
	'好',
	'啊',
	'那',
	'早',
	'上',
	'九',
	'点',
	'门',
	'口',
	'等'
];

// Initialize sets to avoid duplicates
const level1Components = new Set();
const level2Components = new Set();

// Iterate over the characters and decompose each one
characters.forEach((char) => {
	// Level 1 decomposition
	const decomposition1 = hanzi.decompose(char, 1);
	if (decomposition1.components) {
		decomposition1.components.forEach((comp) => {
			if (comp !== 'No glyph available') level1Components.add(comp);
		});
	}

	// Level 2 decomposition
	const decomposition2 = hanzi.decompose(char, 2);
	if (decomposition2.components) {
		decomposition2.components.forEach((comp) => {
			if (comp !== 'No glyph available') level2Components.add(comp);
		});
	}
});

// ... existing code ...

// Convert sets to arrays
const level1ComponentsArray = Array.from(level1Components);
const level2ComponentsArray = Array.from(level2Components);

// Log the results
console.log('Level 1 Components:', level1ComponentsArray);
console.log('Level 2 Components:', level2ComponentsArray);

// Define file paths
const level1FilePath = 'image_generation/mnemonics/level1_components.json';
const level2FilePath = 'image_generation/mnemonics/level2_components.json';

// Write the arrays to JSON files
fs.writeFileSync(level1FilePath, JSON.stringify(level1ComponentsArray, null, 2));
fs.writeFileSync(level2FilePath, JSON.stringify(level2ComponentsArray, null, 2));

console.log(`Level 1 components saved to ${level1FilePath}`);
console.log(`Level 2 components saved to ${level2FilePath}`);
