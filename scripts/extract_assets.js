import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const html = fs.readFileSync(path.join(__dirname, '../example/Floriva – iPhone UI.html'), 'utf8');
const lines = html.split('\n');

const line87 = lines[86]; // 0-indexed line 87
const match = line87.match(/src="data:image\/jpeg;base64,([^"]+)"/);
if (match) {
  const targetDir = path.join(__dirname, '../public/images');
  fs.mkdirSync(targetDir, { recursive: true });
  fs.writeFileSync(path.join(targetDir, 'onboarding-flowers.jpg'), Buffer.from(match[1], 'base64'));
  console.log('Saved onboarding-flowers.jpg successfully! Size:', fs.statSync(path.join(targetDir, 'onboarding-flowers.jpg')).size);
} else {
  console.error('Could not find base64 image in line 87');
}
