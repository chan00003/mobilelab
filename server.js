import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { execSync } from 'child_process';
import compression from 'compression';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0';

// Enable Gzip/Deflate text compression for all responses
app.use(compression({
  level: 6,
  threshold: 0,
  filter: (req, res) => {
    if (req.headers['x-no-compression']) {
      return false;
    }
    return compression.filter(req, res);
  }
}));

// Performance and security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Timing-Allow-Origin', '*');
  next();
});

// Helper to ensure fresh zip archive for GitHub including all optimized assets
function ensureZipArchive() {
  try {
    execSync(
      `python3 -c "import zipfile, os; z = zipfile.ZipFile('mobilelab-github.zip', 'w', zipfile.ZIP_DEFLATED); files = ['index.html', 'about.html', 'services.html', 'how-we-work.html', 'contact.html', 'mobilelab-ogimage.png', 'server.js', 'package.json', '.env.example', '.gitignore', 'README.md']; [z.write(f) for f in files if os.path.exists(f)]; [(z.write(os.path.join(r, f))) for r, d, fnames in os.walk('assets') for f in fnames]; z.close()"`
    );
  } catch (err) {
    console.error('Error generating zip:', err);
  }
}

// Download endpoints for GitHub zip package
app.get(['/download', '/download-zip', '/api/download'], (req, res) => {
  ensureZipArchive();
  const zipPath = path.join(__dirname, 'mobilelab-github.zip');
  if (fs.existsSync(zipPath)) {
    res.download(zipPath, 'mobilelab-github.zip');
  } else {
    res.status(500).send('Could not generate zip archive');
  }
});

// Dedicated route for Open Graph image with long-term caching
app.get('/mobilelab-ogimage.png', (req, res) => {
  res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
  res.type('image/png').sendFile(path.join(__dirname, 'mobilelab-ogimage.png'));
});

// Serve assets with 1-year immutable browser cache
app.use('/assets', express.static(path.join(__dirname, 'assets'), {
  maxAge: '1y',
  immutable: true,
  etag: true,
  lastModified: true
}));

// Serve public static directory if present
if (fs.existsSync(path.join(__dirname, 'public'))) {
  app.use(express.static(path.join(__dirname, 'public'), {
    maxAge: '1y',
    immutable: true,
    etag: true,
    lastModified: true
  }));
}

// Explicit dedicated page routes with efficient caching
const sendCachedHtml = (res, filePath) => {
  res.setHeader('Cache-Control', 'public, max-age=3600, stale-while-revalidate=86400');
  res.sendFile(filePath);
};

app.get('/services', (req, res) => {
  sendCachedHtml(res, path.join(__dirname, 'services.html'));
});

app.get('/how-we-work', (req, res) => {
  sendCachedHtml(res, path.join(__dirname, 'how-we-work.html'));
});

app.get('/about', (req, res) => {
  sendCachedHtml(res, path.join(__dirname, 'about.html'));
});

app.get('/contact', (req, res) => {
  sendCachedHtml(res, path.join(__dirname, 'contact.html'));
});

// Static assets from root (css, js, images)
app.use(express.static(__dirname, {
  maxAge: '1d',
  etag: true,
  lastModified: true,
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.html')) {
      res.setHeader('Cache-Control', 'public, max-age=3600, stale-while-revalidate=86400');
    } else if (filePath.match(/\.(png|jpg|jpeg|webp|avif|svg|gif|ico|woff|woff2|ttf|css|js)$/i)) {
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    }
  }
}));

// Fallback to index.html for all other routes
app.get('*', (req, res) => {
  sendCachedHtml(res, path.join(__dirname, 'index.html'));
});

app.listen(PORT, HOST, () => {
  console.log(`Optimized server running on http://${HOST}:${PORT}`);
});
