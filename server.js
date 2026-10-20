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
  ['blog.html', 'blog.html'],
  ['work.html', 'work.html'],
  ['content.html', 'content.html'],
  ['content.js', 'content.js'],
  ['content.css', 'content.css'],
  ['navigation.js', 'navigation.js'],
  ['mobilelab-ogimage.png', 'mobilelab-ogimage.png'],
  ['server.js', 'server.js'],
  ['package.json', 'package.json'],
  ['.env.example', '.env.example'],
  ['.gitignore', '.gitignore'],
  ['README.md', 'README.md'],
];
const ARCHIVE_ASSET_FILES = [
  'assets/favicon.ico', 'assets/favicon.svg', 'assets/images/image-map.json',
  'assets/images/img-058d42093f.webp', 'assets/images/img-05df0a0a45.webp', 'assets/images/img-05ffa92e4c.webp',
  'assets/images/img-11340ab1b3.webp', 'assets/images/img-1501d47931.webp', 'assets/images/img-1924ba6c49.webp',
  'assets/images/img-1bd7fb7ce5.webp', 'assets/images/img-201f6e4e4c.webp', 'assets/images/img-2241a8f015.webp',
  'assets/images/img-2ff7330dfa.webp', 'assets/images/img-30bd8d0c1a.webp', 'assets/images/img-3311de6663.webp',
  'assets/images/img-35113cdc5f.webp', 'assets/images/img-3df07336cc.webp', 'assets/images/img-464e9668f1.webp',
  'assets/images/img-48a7b42d3e.webp', 'assets/images/img-4af4439387.webp', 'assets/images/img-4c87ffd860.webp',
  'assets/images/img-501f524cba.webp', 'assets/images/img-6035240480.webp', 'assets/images/img-60a0fb8b74.webp',
  'assets/images/img-60df726d53.webp', 'assets/images/img-6143dc219a.webp', 'assets/images/img-6342992ee4.webp',
  'assets/images/img-65530cf809.webp', 'assets/images/img-769fd0d30b.webp', 'assets/images/img-79101e9c13.webp',
  'assets/images/img-7ac5247604.webp', 'assets/images/img-7b4b8699a8.webp', 'assets/images/img-7c5ea8939b.webp',
  'assets/images/img-8049566dda.webp', 'assets/images/img-82ce65c455.webp', 'assets/images/img-85019b70e3.webp',
  'assets/images/img-8b603ce21c.webp', 'assets/images/img-8c49655875.webp', 'assets/images/img-9336e41e7f.webp',
  'assets/images/img-a62a271d54.webp', 'assets/images/img-a797373c93.webp', 'assets/images/img-ab8c572c61.webp',
  'assets/images/img-ad90c3a9da.webp', 'assets/images/img-b1fc591c78.webp', 'assets/images/img-b6e99ae66b.webp',
  'assets/images/img-bb96c671a7.webp', 'assets/images/img-bf765c255f.webp', 'assets/images/img-bfe570da4c.webp',
  'assets/images/img-bfe71351eb.webp', 'assets/images/img-c1c8f6512a.webp', 'assets/images/img-c4de067aee.webp',
  'assets/images/img-c6319bdae7.webp', 'assets/images/img-cc4ea19618.webp', 'assets/images/img-cce1e0fde3.webp',
  'assets/images/img-d00d3b7df0.webp', 'assets/images/img-dbee276213.webp', 'assets/images/img-dee6f8bc5c.webp',
  'assets/images/img-e02454e2d3.webp', 'assets/images/img-e0a24faf70.webp', 'assets/images/img-e2e97a29ea.webp',
  'assets/images/img-e525e91aca.webp', 'assets/images/img-e60fcb6ee9.webp', 'assets/images/img-eaf6601428.webp',
  'assets/images/img-f008aafa70.webp', 'assets/images/img-f8552506c7.webp', 'assets/images/img-fcc9f69eac.webp',
  'assets/images/method-diagnose.jpg', 'assets/images/method-diagnose.webp', 'assets/images/mobilelab-ogimage.webp',
  'assets/images/team-ava.jpg', 'assets/images/team-ava.webp', 'assets/images/team-christian.jpg', 'assets/images/team-christian.webp',
  'assets/images/team-dave.jpg', 'assets/images/team-dave.webp', 'assets/images/team-david.jpg', 'assets/images/team-david.webp',
  'assets/images/team-elena.jpg', 'assets/images/team-elena.webp', 'assets/images/team-matt.jpg', 'assets/images/team-matt.webp',
  'assets/mobilelab-logo.svg',
];
const ARCHIVE_MEMBER_SOURCES = [
  ...ARCHIVE_FILES,
  ...ARCHIVE_ASSET_FILES.map((name) => [name, name]),
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

function resolveArchiveSource(source) {
  const publicPath = path.join(PUBLIC_DIR, source);
  const rootPath = path.join(__dirname, source);
  return fs.existsSync(publicPath) ? publicPath : fs.existsSync(rootPath) ? rootPath : null;
}

function isSafeArchiveMemberName(name) {
  return typeof name === 'string'
    && name.length > 0
    && !path.isAbsolute(name)
    && name.split('/').every((segment) => segment && segment !== '.' && segment !== '..');
}

function getArchiveEntries(resolveSource = resolveArchiveSource, memberSources = ARCHIVE_MEMBER_SOURCES) {
  const names = new Set();
  const entries = [];
  for (const [source, name] of memberSources) {
    if (!isSafeArchiveMemberName(source) || !isSafeArchiveMemberName(name) || names.has(name)) return null;
    const sourcePath = resolveSource(source);
    if (!sourcePath) return null;
    names.add(name);
    entries.push([sourcePath, name]);
  }
  return entries;
}

function createZipArchive() {
  const resolveSource = app.locals.resolveArchiveSource || resolveArchiveSource;
  const archiveSources = getArchiveEntries(resolveSource);
  if (!archiveSources) return null;
  const archive = new archiverModule.ZipArchive({ zlib: { level: 9 } });
  for (const [sourcePath, name] of archiveSources) {
    archive.file(sourcePath, { name });
  }
  return archive;
}

function cleanupZipArchive(archive) {
  archive?.abort?.();
}

app.locals.createZipArchive = createZipArchive;
app.locals.cleanupZipArchive = cleanupZipArchive;
app.locals.resolveArchiveSource = resolveArchiveSource;
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
app.get('/blog', (req, res) => sendCachedHtml(res, path.join(PUBLIC_DIR, 'blog.html')));
app.get('/work', (req, res) => sendCachedHtml(res, path.join(PUBLIC_DIR, 'work.html')));
app.get('/blog/:slug', (req, res) => sendCachedHtml(res, path.join(PUBLIC_DIR, 'content.html')));
app.get('/work/:slug', (req, res) => sendCachedHtml(res, path.join(PUBLIC_DIR, 'content.html')));
app.get('/content.css', (req, res) => res.sendFile(path.join(PUBLIC_DIR, 'content.css')));
app.get('/content.js', (req, res) => res.sendFile(path.join(PUBLIC_DIR, 'content.js')));
app.get('/navigation.js', (req, res) => res.sendFile(path.join(PUBLIC_DIR, 'navigation.js')));
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

export { app, cleanupZipArchive, createZipArchive, getArchiveEntries, isSafeArchiveMemberName, resolveArchiveSource };
export default app;

if (process.argv[1] && path.resolve(process.argv[1]) === __filename) {
  app.listen(PORT, HOST, () => console.log(`Server running on http://${HOST}:${PORT}`));
}
