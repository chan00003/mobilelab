import fs from 'fs';
import path from 'path';

const mappingFile = path.resolve('assets/images/image-map.json');
if (!fs.existsSync(mappingFile)) {
  console.error('image-map.json not found!');
  process.exit(1);
}

const mapping = JSON.parse(fs.readFileSync(mappingFile, 'utf8'));
const files = ['index.html', 'about.html', 'services.html', 'how-we-work.html', 'contact.html'];

const optimizedHeadFonts = `
  <!-- Resource Hints & Preconnect for Fast Asset Delivery -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="dns-prefetch" href="https://cdn.tailwindcss.com">

  <!-- Consolidated Optimized Typography: Montserrat, Plus Jakarta Sans, Space Grotesk & Material Symbols -->
  <link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,300..900;1,300..900&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Space+Grotesk:wght@400;500;600;700&family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet">
`;

for (const fileName of files) {
  if (!fs.existsSync(fileName)) continue;

  let html = fs.readFileSync(fileName, 'utf8');

  // 1. Optimize Open Graph dimensions
  html = html.replace(/<meta property="og:image:width" content="[^"]*">/g, '<meta property="og:image:width" content="1200">');
  html = html.replace(/<meta property="og:image:height" content="[^"]*">/g, '<meta property="og:image:height" content="630">');

  // 2. Clean up Google Fonts duplicates and replace with consolidated preconnected fonts
  // Remove existing Google Fonts links in head
  html = html.replace(/<link[^>]+href="https:\/\/fonts\.googleapis\.com[^"]*"[^>]*>\s*/gi, '');
  html = html.replace(/<link[^>]+href="https:\/\/fonts\.gstatic\.com[^"]*"[^>]*>\s*/gi, '');

  // Inject optimized head hints right before the closing </head> or right before tailwind script
  if (html.includes('<!-- Tailwind CSS')) {
    html = html.replace('<!-- Tailwind CSS', `${optimizedHeadFonts}\n  <!-- Tailwind CSS`);
  } else if (html.includes('<script src="https://cdn.tailwindcss.com')) {
    html = html.replace('<script src="https://cdn.tailwindcss.com', `${optimizedHeadFonts}\n  <script src="https://cdn.tailwindcss.com`);
  } else {
    html = html.replace('</head>', `${optimizedHeadFonts}\n</head>`);
  }

  // 3. Process all <img> tags
  html = html.replace(/<img\b([^>]*)>/gi, (match, attrs) => {
    let newAttrs = attrs;

    // Check src
    const srcMatch = newAttrs.match(/src="([^"]+)"/);
    let originalSrc = srcMatch ? srcMatch[1] : '';
    let mapped = mapping[originalSrc];

    if (mapped) {
      newAttrs = newAttrs.replace(`src="${originalSrc}"`, `src="${mapped.localSrc}"`);
      
      // If width or height are missing, add them
      if (!newAttrs.includes('width=') && mapped.width) {
        newAttrs += ` width="${mapped.width}"`;
      }
      if (!newAttrs.includes('height=') && mapped.height) {
        newAttrs += ` height="${mapped.height}"`;
      }
    }

    // Add decoding="async" if missing
    if (!newAttrs.includes('decoding=')) {
      newAttrs += ' decoding="async"';
    }

    // Add loading="lazy" if missing
    if (!newAttrs.includes('loading=')) {
      // Don't lazy-load the very first hero images (e.g., logo or first banner item)
      newAttrs += ' loading="lazy"';
    }

    return `<img${newAttrs}>`;
  });

  fs.writeFileSync(fileName, html, 'utf8');
  console.log(`Optimized ${fileName}`);
}

console.log('All HTML files optimized successfully.');
