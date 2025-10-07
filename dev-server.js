const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3001;
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;

if (!DEEPSEEK_API_KEY) {
  console.error('❌ ERROR: DEEPSEEK_API_KEY environment variable is not set!');
  console.error('Please set it in your environment or Render dashboard.');
  process.exit(1);
}

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

  // API proxy endpoint for DeepSeek
  if (req.method === 'POST' && req.url === '/api/chat') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', () => {
      try {
        const requestData = JSON.parse(body);
        const postData = JSON.stringify(requestData);

        const options = {
          hostname: 'api.deepseek.com',
          path: '/chat/completions',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
            'Content-Length': Buffer.byteLength(postData)
          }
        };

        const proxyReq = https.request(options, (proxyRes) => {
          let responseData = '';
          proxyRes.on('data', (chunk) => {
            responseData += chunk;
          });
          proxyRes.on('end', () => {
            console.log('DeepSeek response status:', proxyRes.statusCode);
            res.writeHead(proxyRes.statusCode, {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': origin
            });
            res.end(responseData);
          });
        });

        proxyReq.on('error', (error) => {
          console.error('Proxy request error:', error);
          let errorMessage = error.message;
          if (error.code === 'ECONNRESET') {
            errorMessage = 'Connection to DeepSeek API was reset. Please try again.';
          }
          res.writeHead(500, {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': origin
          });
          res.end(JSON.stringify({ error: errorMessage }));
        });

        proxyReq.write(postData);
        proxyReq.end();
      } catch (error) {
        res.writeHead(400, {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': origin
        });
        res.end(JSON.stringify({ error: 'Invalid JSON' }));
      }
    });
    return;
  }

  // Landing page route
  if (req.method === 'GET' && (req.url === '/' || req.url === '/landing.html')) {
    fs.readFile(path.join(__dirname, 'landing.html'), 'utf8', (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/html' });
        res.end('Error loading landing page');
        return;
      }
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(data);
    });
    return;
  }

  // Obert app route
  if (req.method === 'GET' && (req.url.startsWith('/app') || req.url === '/obert-ai.html')) {
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
