import assert from 'node:assert/strict';
import path from 'node:path';
import http from 'node:http';
import { after, before, describe, it } from 'node:test';
import unzipper from 'unzipper';
import {
  app,
  cleanupZipArchive,
  createZipArchive,
  getArchiveEntries,
  isSafeArchiveMemberName,
  resolveArchiveSource,
} from '../server.js';

let server;
let baseUrl;

before(async () => {
  await new Promise((resolve) => {
    server = app.listen(0, '127.0.0.1', resolve);
  });
  const { port } = server.address();
  baseUrl = `http://127.0.0.1:${port}`;
});

after(() => {
  app.locals.createZipArchive = createZipArchive;
  app.locals.cleanupZipArchive = cleanupZipArchive;
  app.locals.resolveArchiveSource = undefined;
  server.close();
});

async function request(route, options) {
  return fetch(`${baseUrl}${route}`, options);
}

async function archiveBuffer(archive) {
  const chunks = [];
  archive.on('data', (chunk) => chunks.push(chunk));
  await archive.finalize();
  return Buffer.concat(chunks);
}

describe('server routes', () => {
  it('serves the home page at /', async () => {
    const response = await request('/');
    const body = await response.text();

    assert.equal(response.status, 200);
    assert.match(response.headers.get('content-type'), /text\/html/);
    assert.match(body, /Mobile Lab/i);
  });

  it('serves the contact page at /contact', async () => {
    const response = await request('/contact');
    const body = await response.text();

    assert.equal(response.status, 200);
    assert.match(body, /contact/i);
  });

  it('falls back to the home page for unknown routes', async () => {
    const response = await request('/not-a-real-route');
    const body = await response.text();

    assert.equal(response.status, 200);
    assert.match(body, /Mobile Lab/i);
  });

  it('sets security headers and does not expose repository files', async () => {
    const response = await request('/');
    assert.equal(response.headers.get('x-content-type-options'), 'nosniff');
    assert.equal(response.headers.get('x-frame-options'), 'DENY');
    assert.match(response.headers.get('content-security-policy'), /cdn\.tailwindcss\.com/);

    for (const sensitivePath of ['/server.js', '/package.json', '/.git/config']) {
      const sensitiveResponse = await request(sensitivePath);
      assert.equal(sensitiveResponse.status, 404, sensitivePath);
    }
  });

  it('serves a valid generated ZIP archive', async () => {
    app.locals.createZipArchive = createZipArchive;
    app.locals.cleanupZipArchive = cleanupZipArchive;
    const response = await request('/download');
    const bytes = Buffer.from(await response.arrayBuffer());
    const directory = await unzipper.Open.buffer(bytes);
    const names = directory.files.map((file) => file.path);
    await Promise.all(directory.files.map((file) => file.buffer()));
    const index = await directory.files.find((file) => file.path === 'index.html').buffer();

    assert.equal(response.status, 200);
    assert.match(response.headers.get('content-type'), /application\/zip/);
    assert.deepEqual(bytes.subarray(0, 2), Buffer.from('PK'));
    assert.ok(bytes.length < 4.5 * 1024 * 1024, 'archive exceeds Vercel response limit');
    assert.equal(new Set(names).size, names.length, 'archive contains duplicate members');
    assert.ok(names.every((name) => isSafeArchiveMemberName(name)), 'archive contains an unsafe member name');
    assert.ok(names.every((name) => !name.endsWith('/')), 'archive contains directory metadata entries');
    assert.ok(names.includes('index.html'));
    assert.ok(names.includes('server.js'));
    assert.ok(names.includes('assets/favicon.ico'));
    assert.ok(names.includes('assets/favicon.svg'));
    assert.ok(names.includes('assets/mobilelab-logo.svg'));
    assert.match(index.toString('utf8'), /Mobile Lab/i);
  });

  it('keeps the local and serverless archive manifests identical', () => {
    const localEntries = getArchiveEntries(resolveArchiveSource);
    const bundledEntries = getArchiveEntries((source) => path.join(process.cwd(), 'public', source));

    assert.ok(localEntries);
    assert.ok(bundledEntries);
    assert.deepEqual(
      localEntries.map(([, name]) => name),
      bundledEntries.map(([, name]) => name),
    );
  });

  it('fails closed when a required archive source is missing', () => {
    for (const missing of ['assets/favicon.ico', 'assets/favicon.svg', 'assets/mobilelab-logo.svg']) {
      app.locals.resolveArchiveSource = (source) => source === missing ? null : resolveArchiveSource(source);
      assert.equal(createZipArchive(), null, missing);
    }
    app.locals.resolveArchiveSource = resolveArchiveSource;
  });

  it('rejects duplicate and path-traversal archive members', () => {
    assert.equal(getArchiveEntries(resolveArchiveSource, [
      ['index.html', 'index.html'],
      ['about.html', 'index.html'],
    ]), null);
    assert.equal(isSafeArchiveMemberName('../server.js'), false);
    assert.equal(isSafeArchiveMemberName('/etc/passwd'), false);
    assert.equal(isSafeArchiveMemberName('assets/../server.js'), false);
  });

  it('detects a corrupt archive instead of treating it as valid', async () => {
    const bytes = await archiveBuffer(createZipArchive());
    await assert.rejects(unzipper.Open.buffer(bytes.subarray(0, bytes.length - 32)));
  });

  it('returns a server error when the function bundle omits an archive source', async () => {
    app.locals.resolveArchiveSource = () => null;
    app.locals.createZipArchive = createZipArchive;

    for (const route of ['/download', '/download-zip', '/api/download']) {
      const response = await request(route);
      const body = await response.text();

      assert.equal(response.status, 500);
      assert.equal(body, 'Could not generate zip archive');
    }
    app.locals.resolveArchiveSource = resolveArchiveSource;
  });

  it('handles concurrent downloads with isolated archive streams', async () => {
    app.locals.createZipArchive = createZipArchive;
    app.locals.cleanupZipArchive = cleanupZipArchive;

    const responses = await Promise.all(
      Array.from({ length: 5 }, () => request('/download')),
    );
    const archives = await Promise.all(responses.map(async (response) => unzipper.Open.buffer(Buffer.from(await response.arrayBuffer()))));

    assert.deepEqual(responses.map((response) => response.status), [200, 200, 200, 200, 200]);
    assert.ok(archives.every((archive) => archive.files.some((file) => file.path === 'index.html')));
  });

  it('aborts archive generation when the client disconnects', async () => {
    let aborted = false;
    const archive = {
      response: null,
      on() { return this; },
      pipe(response) {
        this.response = response;
        response.writeHead(200, { 'content-type': 'application/zip' });
        response.write(Buffer.alloc(1_000_000));
        return response;
      },
      finalize() { return new Promise(() => {}); },
      abort() {
        aborted = true;
        this.response?.destroy();
      },
    };
    app.locals.createZipArchive = () => archive;

    await new Promise((resolve, reject) => {
      const client = http.get(`${baseUrl}/download`, (response) => {
        response.destroy();
        setTimeout(resolve, 250);
      });
      client.on('error', (error) => {
        if (error.code !== 'ECONNRESET') reject(error);
      });
    });

    assert.equal(aborted, true);
    app.locals.createZipArchive = createZipArchive;
    app.locals.cleanupZipArchive = cleanupZipArchive;
  });

  it('validates contact submissions and does not claim delivery is configured', async () => {
    const invalid = await request('/api/contact', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ name: '', email: 'not-an-email', fix: '' }),
    });
    assert.equal(invalid.status, 400);
    assert.match((await invalid.json()).error, /required|valid/i);

    const valid = await request('/api/contact', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ name: 'Test User', email: 'test@example.com', fix: 'A real bottleneck.' }),
    });
    assert.equal(valid.status, 503);
    assert.match((await valid.json()).error, /not configured/i);
  });

  it('rejects oversized contact requests', async () => {
    const response = await request('/api/contact', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ name: 'Test User', email: 'test@example.com', fix: 'x'.repeat(11_000) }),
    });
    assert.equal(response.status, 413);
  });
});
