const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3001;
const PREVIEW_FILE = path.join(__dirname, 'preview.html');
const OBERT_FILE = path.join(__dirname, 'obert-ai.html');

// Single unified server for both app and preview
const server = http.createServer((req, res) => {
  const origin = req.headers.origin || '*';
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // Preview routes
  if (req.url === '/preview') {
    fs.readFile(PREVIEW_FILE, 'utf8', (err, data) => {
      if (err) {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(`<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Obert Preview</title>
  <style>
    body {
      margin: 0;
      padding: 40px;
      font-family: system-ui, -apple-system, sans-serif;
      background: #1a1a1a;
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
    }
    .message {
      text-align: center;
      max-width: 500px;
    }
    h1 { color: #8b5cf6; margin-bottom: 1rem; }
    p { color: #999; line-height: 1.6; }
  </style>
</head>
<body>
  <div class="message">
    <h1>🚀 Preview Ready</h1>
    <p>Generate code in Obert and it will appear here!</p>
  </div>
</body>
</html>`);
        return;
      }
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(data);
    });
    return;
  }

  // Update preview endpoint
  if (req.method === 'POST' && req.url === '/preview/update') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', () => {
      try {
        const { html } = JSON.parse(body);
        fs.writeFile(PREVIEW_FILE, html, 'utf8', (err) => {
          if (err) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, error: err.message }));
            return;
          }
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: true }));
        });
      } catch (error) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: 'Invalid JSON' }));
      }
    });
    return;
  }

  // Main Obert app route
  if (req.method === 'GET' && (req.url === '/' || req.url.startsWith('/app'))) {
    fs.readFile(OBERT_FILE, 'utf8', (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/html' });
        res.end('Error loading Obert');
        return;
      }
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(data);
    });
    return;
  }

  res.writeHead(404);
  res.end('Not found');
});

server.listen(PORT, () => {
  console.log(`🚀 Obert app running on http://localhost:${PORT}`);
  console.log(`📡 Preview available at http://localhost:${PORT}/preview`);
});

// Create initial preview.html if it doesn't exist
if (!fs.existsSync(PREVIEW_FILE)) {
  fs.writeFileSync(PREVIEW_FILE, `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Obert Preview</title>
  <style>
    body {
      margin: 0;
      padding: 40px;
      font-family: system-ui, -apple-system, sans-serif;
      background: #1a1a1a;
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
    }
    .message {
      text-align: center;
      max-width: 500px;
    }
    h1 { color: #8b5cf6; margin-bottom: 1rem; }
    p { color: #999; line-height: 1.6; }
  </style>
</head>
<body>
  <div class="message">
    <h1>🚀 Preview Ready</h1>
    <p>Generate code in Obert and it will appear here!</p>
  </div>
</body>
</html>`);
}
