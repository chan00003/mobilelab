import express from 'express';
import compression from 'compression';
import * as archiverModule from 'archiver';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0';
const PUBLIC_DIR = path.join(__dirname, 'public');
const ARCHIVE_FILES = [
  ['index.html', 'index.html'],
  ['about.html', 'about.html'],
  ['services.html', 'services.html'],
  ['how-we-work.html', 'how-we-work.html'],
  ['contact.html', 'contact.html'],
  ['mobilelab-ogimage.png', 'mobilelab-ogimage.png'],
  ['server.js', 'server.js'],
  ['package.json', 'package.json'],
  ['.env.example', '.env.example'],
  ['.gitignore', '.gitignore'],
  ['README.md', 'README.md'],
];

const contentSecurityPolicy = [
  "default-src 'self'", "base-uri 'self'", "frame-ancestors 'none'", "object-src 'none'", "form-action 'self'",
  "script-src 'self' 'unsafe-inline' https://cdn.tailwindcss.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com data:",
  "img-src 'self' https://lh3.googleusercontent.com data:", "connect-src 'self'",
].join('; ');

app.disable('x-powered-by');
app.use(compression({ level: 6, threshold: 0 }));
app.use((req, res, next) => {
  res.setHeader('Content-Security-Policy', contentSecurityPolicy);
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  res.setHeader('Timing-Allow-Origin', '*');
  next();
});

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: false, limit: '10kb' }));

function createRateLimiter({ windowMs, max }) {
  const buckets = new Map();
  return (req, res, next) => {
    const now = Date.now();
    for (const [key, bucket] of buckets) {
      if (now - bucket.startedAt >= windowMs) buckets.delete(key);
    }
    const key = req.ip || req.socket.remoteAddress || 'unknown';
    const bucket = buckets.get(key);
    if (!bucket || now - bucket.startedAt >= windowMs) {
      buckets.set(key, { startedAt: now, count: 1 });
      return next();
    }
    if (bucket.count >= max) {
      res.setHeader('Retry-After', String(Math.ceil((windowMs - (now - bucket.startedAt)) / 1000)));
      return res.status(429).send('Too many requests');
    }
    bucket.count += 1;
    return next();
  };
}

const downloadRateLimit = createRateLimiter({ windowMs: 60_000, max: 10 });
const contactRateLimit = createRateLimiter({ windowMs: 15 * 60_000, max: 5 });

function createZipArchive() {
  if (!ARCHIVE_FILES.every(([source]) => fs.existsSync(path.join(PUBLIC_DIR, source)) || fs.existsSync(path.join(__dirname, source)))) {
    return null;
  }
  const archive = new archiverModule.ZipArchive({ zlib: { level: 9 } });
  for (const [source, name] of ARCHIVE_FILES) {
    const sourcePath = fs.existsSync(path.join(PUBLIC_DIR, source))
      ? path.join(PUBLIC_DIR, source)
      : path.join(__dirname, source);
    archive.file(sourcePath, { name });
  }
  const assetsPath = path.join(PUBLIC_DIR, 'assets');
  if (fs.existsSync(assetsPath)) archive.directory(assetsPath, 'assets');
  return archive;
}

function cleanupZipArchive(archive) {
  archive?.abort?.();
}

app.locals.createZipArchive = createZipArchive;
app.locals.cleanupZipArchive = cleanupZipArchive;
app.get(['/download', '/download-zip', '/api/download'], downloadRateLimit, (req, res, next) => {
  const archive = app.locals.createZipArchive();
  if (!archive) {
    return res.status(500).send('Could not generate zip archive');
  }
  let finished = false;
  const abortArchive = () => {
    if (!finished) app.locals.cleanupZipArchive(archive);
  };
  const handleArchiveError = (err) => {
    abortArchive();
    if (!res.headersSent) return next(err);
    return res.destroy(err);
  };
  archive.on('error', handleArchiveError);
  req.on('aborted', abortArchive);
  res.on('close', abortArchive);
  res.on('finish', () => {
    finished = true;
  });
  res.attachment('mobilelab-github.zip');
  archive.pipe(res);
  archive.finalize().catch(handleArchiveError);
  return undefined;
});

function validateContactPayload(body = {}) {
  const name = typeof body.name === 'string' ? body.name.trim() : '';
  const email = typeof body.email === 'string' ? body.email.trim() : '';
  const fix = typeof body.fix === 'string' ? body.fix.trim() : '';
  if (!name || name.length > 100) return 'Name is required and must be 100 characters or fewer.';
  if (!/^\S+@\S+\.\S+$/.test(email) || email.length > 254) return 'A valid email address is required.';
  if (!fix || fix.length > 5_000) return 'Please describe the bottleneck in 5,000 characters or fewer.';
  return null;
}

app.post('/api/contact', contactRateLimit, (req, res) => {
  const validationError = validateContactPayload(req.body);
  if (validationError) return res.status(400).json({ error: validationError });
  return res.status(503).json({ error: 'Contact delivery is not configured.' });
});

const sendCachedHtml = (res, filePath) => {
  res.setHeader('Cache-Control', 'public, max-age=3600, stale-while-revalidate=86400');
  res.sendFile(filePath);
};

app.get('/', (req, res) => sendCachedHtml(res, path.join(PUBLIC_DIR, 'index.html')));
app.get('/index.html', (req, res) => sendCachedHtml(res, path.join(PUBLIC_DIR, 'index.html')));
app.get('/services', (req, res) => sendCachedHtml(res, path.join(PUBLIC_DIR, 'services.html')));
app.get('/how-we-work', (req, res) => sendCachedHtml(res, path.join(PUBLIC_DIR, 'how-we-work.html')));
app.get('/about', (req, res) => sendCachedHtml(res, path.join(PUBLIC_DIR, 'about.html')));
app.get('/contact', (req, res) => sendCachedHtml(res, path.join(PUBLIC_DIR, 'contact.html')));
app.get('/contact.html', (req, res) => sendCachedHtml(res, path.join(PUBLIC_DIR, 'contact.html')));
app.get('/mobilelab-ogimage.png', (req, res) => {
  res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
  res.type('image/png').sendFile(path.join(PUBLIC_DIR, 'mobilelab-ogimage.png'));
});
app.use('/assets', express.static(path.join(PUBLIC_DIR, 'assets'), { maxAge: '1y', immutable: true, etag: true, lastModified: true }));
app.get('*', (req, res) => {
  const segments = req.path.split('/').filter(Boolean);
  if (path.extname(req.path) || segments.some((segment) => segment.startsWith('.'))) return res.status(404).send('Not found');
  return sendCachedHtml(res, path.join(PUBLIC_DIR, 'index.html'));
});
app.use((err, req, res, next) => {
  if (err.type === 'entity.too.large') return res.status(413).json({ error: 'Request too large.' });
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) return res.status(400).json({ error: 'Invalid request body.' });
  if (res.headersSent) return next(err);
  console.error('Unhandled request error:', err);
  return res.status(500).send('Internal server error');
});

export { app, cleanupZipArchive, createZipArchive };
export default app;

if (process.argv[1] && path.resolve(process.argv[1]) === __filename) {
  app.listen(PORT, HOST, () => console.log(`Server running on http://${HOST}:${PORT}`));
}
