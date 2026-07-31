const fs = require('fs');

const part1 = require('c:\\Pipe Line\\PranNadi\\app\\src\\ml\\remedies_part1.json');
const part2 = require('c:\\Pipe Line\\PranNadi\\app\\src\\ml\\remedies_part2.json');

const combined = { ...part1, ...part2 };

fs.writeFileSync('c:\\Pipe Line\\PranNadi\\app\\src\\data\\remedies\\remedies.en.json', JSON.stringify(combined, null, 2));

console.log('Successfully generated full remedies.en.json with ' + Object.keys(combined).length + ' entries.');
