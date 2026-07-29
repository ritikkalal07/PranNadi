const { Jimp } = require('jimp');
const path = require('path');

const files = ['icon.png', 'splash-icon.png', 'adaptive-icon.png'];
const assetsDir = path.join(__dirname, '../assets');

async function convertIcons() {
  for (const file of files) {
    const filePath = path.join(assetsDir, file);
    try {
      console.log(`Processing ${file}...`);
      const image = await Jimp.read(filePath);
      await image.write(filePath);
      console.log(`Successfully rewritten ${file} as true PNG.`);
    } catch (err) {
      console.error(`Error processing ${file}:`, err);
    }
  }
}

convertIcons();
