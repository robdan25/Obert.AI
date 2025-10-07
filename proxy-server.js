const http = require('http');
const https = require('https');

const DEEPSEEK_API_KEY = 'sk-bb97234a93c4497483b4b33fb95caacd';
const PORT = 3000;

const server = http.createServer((req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // Only accept POST to /api/chat
  if (req.method !== 'POST' || req.url !== '/api/chat') {
    res.writeHead(404);
    res.end('Not found');
    return;
  }

  let body = '';
  req.on('data', chunk => {
    body += chunk.toString();
  });

  req.on('end', () => {
    try {
      const requestData = JSON.parse(body);

      // Prepare request to DeepSeek
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
          if (proxyRes.statusCode !== 200) {
            console.log('DeepSeek error response:', responseData);
          }
          res.writeHead(proxyRes.statusCode, {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          });
          res.end(responseData);
        });
      });

      proxyReq.on('error', (error) => {
        console.error('Proxy request error:', error);
        console.error('Error code:', error.code);
        console.error('Error message:', error.message);

        let errorMessage = error.message;
        if (error.code === 'ECONNRESET') {
          errorMessage = 'Connection to DeepSeek API was reset. Please check your API key and network connection.';
        }

        res.writeHead(500, {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        });
        res.end(JSON.stringify({
          error: errorMessage,
          code: error.code,
          details: 'Check proxy server logs for more information'
        }));
      });

      proxyReq.write(postData);
      proxyReq.end();

    } catch (error) {
      console.error('Parse error:', error);
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Invalid JSON' }));
    }
  });
});

server.listen(PORT, () => {
  console.log(`🚀 Proxy server running on http://localhost:${PORT}`);
  console.log(`📡 Use this URL in Obert: http://localhost:${PORT}/api/chat`);
});
