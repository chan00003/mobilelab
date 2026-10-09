import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0';

// Helper to ensure fresh zip archive for GitHub
function ensureZipArchive() {
  try {
    execSync(
      `python3 -c "import zipfile, os; files = ['index.html', 'contact.html', 'server.js', 'package.json', '.env.example', '.gitignore', 'README.md']; z = zipfile.ZipFile('mobilelab-github.zip', 'w', zipfile.ZIP_DEFLATED); [z.write(f) for f in files if os.path.exists(f)]; z.close()"`
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

// Explicit contact page route
app.get('/contact', (req, res) => {
  res.sendFile(path.join(__dirname, 'contact.html'));
});

// Serve static assets from root directory
app.use(express.static(__dirname));

// Fallback to index.html for all requests
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, HOST, () => {
  console.log(`Server running on http://${HOST}:${PORT}`);
});
