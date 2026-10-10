import assert from 'node:assert/strict';
import { after, before, describe, it } from 'node:test';
import { app, ensureZipArchive } from '../server.js';

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
  app.locals.ensureZipArchive = ensureZipArchive;
  server.close();
});

async function request(path) {
  return fetch(`${baseUrl}${path}`);
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

  it('returns a server error when the download archive cannot be generated', async () => {
    app.locals.ensureZipArchive = () => {};

    for (const route of ['/download', '/download-zip', '/api/download']) {
      const response = await request(route);
      const body = await response.text();

      assert.equal(response.status, 500);
      assert.equal(body, 'Could not generate zip archive');
    }
  });
});
