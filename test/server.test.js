import assert from 'node:assert/strict';
import fs from 'node:fs';
import { after, before, describe, it } from 'node:test';
import os from 'node:os';
import path from 'node:path';
import { app, cleanupZipArchive, createZipArchive, resolvePythonExecutable } from '../server.js';

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
  server.close();
});

async function request(route, options) {
  return fetch(`${baseUrl}${route}`, options);
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

  it('resolves a verified Python 3.10+ interpreter', () => {
    const python = resolvePythonExecutable();
    assert.match(python.version, /^3\.(1[0-9]|[2-9][0-9])$/);
  });

  it('serves a valid generated ZIP archive', async () => {
    app.locals.createZipArchive = createZipArchive;
    app.locals.cleanupZipArchive = cleanupZipArchive;
    const response = await request('/download');
    const bytes = new Uint8Array(await response.arrayBuffer());

    assert.equal(response.status, 200);
    assert.match(response.headers.get('content-type'), /application\/zip/);
    assert.deepEqual(Array.from(bytes.slice(0, 2)), [80, 75]);
  });

  it('returns a server error when the download archive cannot be generated', async () => {
    app.locals.createZipArchive = () => null;

    for (const route of ['/download', '/download-zip', '/api/download']) {
      const response = await request(route);
      const body = await response.text();

      assert.equal(response.status, 500);
      assert.equal(body, 'Could not generate zip archive');
    }
  });

  it('handles concurrent downloads with isolated archives and cleans them up', async () => {
    const created = [];
    let sequence = 0;
    app.locals.createZipArchive = () => {
      const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'mobilelab-test-'));
      const archive = { dir, path: path.join(dir, 'mobilelab-github.zip') };
      fs.writeFileSync(archive.path, `test-archive-${sequence += 1}`);
      created.push(archive);
      return archive;
    };
    app.locals.cleanupZipArchive = cleanupZipArchive;

    const responses = await Promise.all(
      Array.from({ length: 5 }, () => request('/download')),
    );
    const bodies = await Promise.all(responses.map((response) => response.text()));

    assert.deepEqual(responses.map((response) => response.status), [200, 200, 200, 200, 200]);
    assert.ok(bodies.every((body) => body.startsWith('test-archive-')));
    assert.equal(new Set(created.map((archive) => archive.dir)).size, 5);
    assert.ok(created.every((archive) => !fs.existsSync(archive.dir)));
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
