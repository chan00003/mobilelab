import fs from 'fs';
import path from 'path';
import https from 'https';
import sharp from 'sharp';
import crypto from 'crypto';

const outputDir = path.resolve('assets/images');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const files = ['index.html', 'about.html', 'services.html', 'how-we-work.html', 'contact.html'];
const urlSet = new Set();

for (const file of files) {
  if (fs.existsSync(file)) {
    const content = fs.readFileSync(file, 'utf8');
    const matches = content.match(/https:\/\/lh3\.googleusercontent\.com\/[^\s"'>]+/g) || [];
    for (const url of matches) {
      urlSet.add(url);
    }
  }
}

const urlList = Array.from(urlSet);
console.log(`Found ${urlList.length} unique remote image URLs to process.`);

function downloadBuffer(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return downloadBuffer(res.headers.location).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`Failed to download ${url}: status code ${res.statusCode}`));
      }
      const chunks = [];
      res.on('data', chunk => chunks.push(chunk));
      res.on('end', () => resolve(Buffer.concat(chunks)));
      res.on('error', reject);
    }).on('error', reject);
  });
}

async function run() {
  const mapping = {};
  let successCount = 0;

  for (let i = 0; i < urlList.length; i++) {
    const url = urlList[i];
    const hash = crypto.createHash('md5').update(url).digest('hex').substring(0, 10);
    const fileName = `img-${hash}.webp`;
    const destPath = path.join(outputDir, fileName);
    const localUrl = `/assets/images/${fileName}`;

    try {
      console.log(`[${i + 1}/${urlList.length}] Downloading and optimizing: ${hash}...`);
      const buffer = await downloadBuffer(url);

      const metadata = await sharp(buffer).metadata();
      const origWidth = metadata.width || 800;
      const origHeight = metadata.height || 600;

      // Resize if exceptionally huge to save data, while preserving quality
      let sharpPipeline = sharp(buffer);
      let targetWidth = origWidth;
      let targetHeight = origHeight;

      if (origWidth > 1200) {
        targetWidth = 1200;
        targetHeight = Math.round((origHeight / origWidth) * 1200);
        sharpPipeline = sharpPipeline.resize(targetWidth, targetHeight, { fit: 'inside', withoutEnlargement: true });
      }

      await sharpPipeline
        .webp({ quality: 80, effort: 4 })
        .toFile(destPath);

      const stats = fs.statSync(destPath);
      console.log(` -> Saved ${fileName} (${Math.round(stats.size / 1024)} KB, ${targetWidth}x${targetHeight})`);

      mapping[url] = {
        localSrc: localUrl,
        width: targetWidth,
        height: targetHeight
      };
      successCount++;
    } catch (err) {
      console.error(`Error processing ${url}:`, err.message);
    }
  }

  fs.writeFileSync(path.join(outputDir, 'image-map.json'), JSON.stringify(mapping, null, 2));
  console.log(`Finished processing ${successCount}/${urlList.length} images.`);
}

run();
