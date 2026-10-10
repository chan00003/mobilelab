import express from 'express';
import compression from 'compression';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import os from 'os';
import { execFileSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0';

const contentSecurityPolicy = [
  "default-src 'self'",
  "base-uri 'self'",
  "frame-ancestors 'none'",
  "object-src 'none'",
  "form-action 'self'",
  "script-src 'self' 'unsafe-inline' https://cdn.tailwindcss.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com data:",
  "img-src 'self' https://lh3.googleusercontent.com data:",
  "connect-src 'self'",
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

function pythonVersion(command, args = []) {
  try {
    const output = execFileSync(command, [...args, '--version'], {
      stdio: ['ignore', 'pipe', 'pipe'],
      encoding: 'utf8',
    });
    const version = output.match(/Python\s+(\d+)\.(\d+)/i);
    if (!version) return null;
    const major = Number(version[1]);
    const minor = Number(version[2]);
    return major === 3 && minor >= 10 ? `${major}.${minor}` : null;
  } catch {
    return null;
  }
}

function windowsPythonCandidates() {
  const candidates = [
    { command: 'py', args: ['-3'] },
    { command: 'python.exe', args: [] },
    { command: 'python3.exe', args: [] },
  ];
  const bases = [
    process.env.LOCALAPPDATA && path.join(process.env.LOCALAPPDATA, 'Programs', 'Python'),
    process.env.ProgramFiles && path.join(process.env.ProgramFiles, 'Python'),
    process.env['ProgramFiles(x86)'] && path.join(process.env['ProgramFiles(x86)'], 'Python'),
  ].filter(Boolean);

  for (const base of bases) {
    try {
      for (const entry of fs.readdirSync(base, { withFileTypes: true })) {
        if (entry.isDirectory()) candidates.push({ command: path.join(base, entry.name, 'python.exe'), args: [] });
      }
    } catch {
      // A missing optional installation directory is not an error.
    }
  }
  return candidates;
}

function resolvePythonExecutable() {
  const explicit = process.env.PYTHON_EXECUTABLE?.trim();
  const candidates = explicit
    ? [{ command: explicit, args: explicit.toLowerCase().endsWith('py.exe') ? ['-3'] : [] }]
    : process.platform === 'win32'
      ? windowsPythonCandidates()
      : [{ command: 'python3', args: [] }, { command: 'python', args: [] }];

  for (const candidate of candidates) {
    const version = pythonVersion(candidate.command, candidate.args);
    if (version) return { ...candidate, version };
  }

  throw new Error('Python 3.10+ was not found. Set PYTHON_EXECUTABLE to a verified interpreter.');
}

function createZipArchive() {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'mobilelab-'));
  const zipPath = path.join(tempDir, 'mobilelab-github.zip');
  try {
    const python = resolvePythonExecutable();
    const script = [
      'import os, sys, zipfile',
      'root, output = sys.argv[1], sys.argv[2]',
      "files = ['index.html', 'about.html', 'services.html', 'how-we-work.html', 'contact.html', 'mobilelab-ogimage.png', 'server.js', 'package.json', '.env.example', '.gitignore', 'README.md']",
      'with zipfile.ZipFile(output, "w", zipfile.ZIP_DEFLATED) as archive:',
      '    for name in files:',
      '        source = os.path.join(root, name)',
      '        if os.path.isfile(source): archive.write(source, name)',
      '    assets = os.path.join(root, "assets")',
      '    if os.path.isdir(assets):',
      '        for folder, _, names in os.walk(assets):',
      '            for name in names:',
      '                source = os.path.join(folder, name)',
      '                archive.write(source, os.path.relpath(source, root))',
    ].join('\n');
    execFileSync(python.command, [...python.args, '-c', script, __dirname, zipPath], {
      cwd: __dirname,
      stdio: 'pipe',
    });
    return { path: zipPath, dir: tempDir, python };
  } catch (err) {
    fs.rmSync(tempDir, { recursive: true, force: true });
    console.error('Error generating zip:', err);
    return null;
  }
}

function cleanupZipArchive(archive) {
  if (archive?.dir) fs.rmSync(archive.dir, { recursive: true, force: true });
}

app.locals.createZipArchive = createZipArchive;
app.locals.cleanupZipArchive = cleanupZipArchive;

app.get(['/download', '/download-zip', '/api/download'], downloadRateLimit, (req, res, next) => {
  const archive = app.locals.createZipArchive();
  if (!archive || !fs.existsSync(archive.path)) {
    if (archive) app.locals.cleanupZipArchive(archive);
    return res.status(500).send('Could not generate zip archive');
  }
  return res.download(archive.path, 'mobilelab-github.zip', (err) => {
    app.locals.cleanupZipArchive(archive);
    if (err && !res.headersSent) next(err);
  });
});

function validateContactPayload(body = {}) {
  const name = typeof body.name === 'string' ? body.name.trim() : '';
  const email = typeof body.email === 'string' ? body.email.trim() : '';
  const fix = typeof body.fix === 'string' ? body.fix.trim() : '';
  if (!name || name.length > 100) return 'Name is required and must be 100 characters or fewer.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) return 'A valid email address is required.';
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

app.get('/', (req, res) => sendCachedHtml(res, path.join(__dirname, 'index.html')));
app.get('/index.html', (req, res) => sendCachedHtml(res, path.join(__dirname, 'index.html')));
app.get('/services', (req, res) => sendCachedHtml(res, path.join(__dirname, 'services.html')));
app.get('/how-we-work', (req, res) => sendCachedHtml(res, path.join(__dirname, 'how-we-work.html')));
app.get('/about', (req, res) => sendCachedHtml(res, path.join(__dirname, 'about.html')));
app.get('/contact', (req, res) => sendCachedHtml(res, path.join(__dirname, 'contact.html')));
app.get('/contact.html', (req, res) => sendCachedHtml(res, path.join(__dirname, 'contact.html')));

app.get('/mobilelab-ogimage.png', (req, res) => {
  res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
  res.type('image/png').sendFile(path.join(__dirname, 'mobilelab-ogimage.png'));
});

app.use('/assets', express.static(path.join(__dirname, 'assets'), {
  maxAge: '1y', immutable: true, etag: true, lastModified: true,
}));

if (fs.existsSync(path.join(__dirname, 'public'))) {
  app.use('/public', express.static(path.join(__dirname, 'public'), {
    maxAge: '1y', immutable: true, etag: true, lastModified: true,
  }));
}

app.get('*', (req, res) => {
  const pathSegments = req.path.split('/').filter(Boolean);
  if (path.extname(req.path) || pathSegments.some((segment) => segment.startsWith('.'))) {
    return res.status(404).send('Not found');
  }
  return sendCachedHtml(res, path.join(__dirname, 'index.html'));
});

app.use((err, req, res, next) => {
  if (err.type === 'entity.too.large') return res.status(413).json({ error: 'Request too large.' });
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) return res.status(400).json({ error: 'Invalid request body.' });
  if (res.headersSent) return next(err);
  console.error('Unhandled request error:', err);
  return res.status(500).send('Internal server error');
});

export { app, cleanupZipArchive, createZipArchive, resolvePythonExecutable };

if (process.argv[1] && path.resolve(process.argv[1]) === __filename) {
  app.listen(PORT, HOST, () => {
    console.log(`Server running on http://${HOST}:${PORT}`);
  });
}
