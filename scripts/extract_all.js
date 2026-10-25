import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const html = fs.readFileSync(path.join(__dirname, '../example/Floriva – iPhone UI.html'), 'utf8');

const regex = /<img[^>]+src="data:image\/(jpeg|png);base64,([^"]+)"[^>]*>/g;
let count = 0;
let match;
const targetDir = path.join(__dirname, '../public/images/floriva');
fs.mkdirSync(targetDir, { recursive: true });

const imageNames = [
  'welcome-flowers.jpg',   // 1: Welcome bouquet
  'avatar.jpg',            // 2: Avatar
  'cat-boxes.jpg',         // 3: Flowers in boxes
  'cat-bouquets.jpg',      // 4: Hand bouquets
  'cat-vases.jpg',         // 5: Flowers in vases
  'cat-giftset.jpg',       // 6: Premium giftset
  'banner-special.jpg',    // 7: Floriva special banner
  'pt-weeding.jpg',        // 8: Weeding celebration
  'pt-baby.jpg',           // 9: New baby celebration
  'pt-graduations.jpg',    // 10: Graduations celebration
  'pt-birthday.jpg',       // 11: Birthday celebration
  'product-pink-lily.jpg', // 12: Pink Lily product detail
];

while ((match = regex.exec(html)) !== null) {
  const filename = imageNames[count] || `image-${count + 1}.${match[1] === 'png' ? 'png' : 'jpg'}`;
  const filePath = path.join(targetDir, filename);
  fs.writeFileSync(filePath, Buffer.from(match[2], 'base64'));
  console.log(`Extracted [${count + 1}] -> ${filename} (${(match[2].length / 1024).toFixed(1)} KB)`);
  count++;
}
console.log(`Total extracted: ${count} images into ${targetDir}`);
