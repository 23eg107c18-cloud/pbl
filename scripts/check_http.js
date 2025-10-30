const http = require('http');
const url = process.argv[2] || 'http://127.0.0.1:3001/';

console.log('Checking', url);
const req = http.get(url, (res) => {
  console.log('STATUS:', res.statusCode);
  console.log('HEADERS:', JSON.stringify(res.headers, null, 2));
  let body = '';
  res.setEncoding('utf8');
  res.on('data', chunk => {
    body += chunk;
    if (body.length > 2000) {
      // stop early
      console.log('\nBODY (first 2000 chars):\n', body.slice(0,2000));
      res.destroy();
    }
  });
  res.on('end', () => {
    if (body.length <= 2000) console.log('\nBODY:\n', body);
    process.exit(0);
  });
});
req.on('error', (err) => {
  console.error('Request error:', err.message);
  process.exit(2);
});
