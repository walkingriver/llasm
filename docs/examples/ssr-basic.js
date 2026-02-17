/**
 * LLasM SSR Example: File-Based Routing
 * 
 * Run: node ssr-basic.js
 * Test: curl http://localhost:3000
 * 
 * This example demonstrates file-based SSR routing where:
 * - Each HTML file in the site directory is a route
 * - Pages listed in ssrHandlers get server-side state injection
 * - Other pages are served as static HTML
 * - Links between pages work naturally
 */
import { createServer } from 'http';
import { readFileSync, existsSync, createReadStream, statSync, writeFileSync, mkdirSync } from 'fs';
import { extname, join, normalize, dirname } from 'path';

// === CONFIG ===
const PORT = process.env.PORT || 3000;
const SITE_DIR = join(import.meta.dirname, 'ssr-site');

// === MIME TYPES ===
const MIME = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml'
};

// === SETUP: Create example site if it doesn't exist ===
const setupSite = () => {
  if (existsSync(SITE_DIR)) return;
  
  mkdirSync(SITE_DIR, { recursive: true });
  
  // Copy llasm.js
  const llasmSrc = join(import.meta.dirname, '..', 'llasm.js');
  if (existsSync(llasmSrc)) {
    writeFileSync(join(SITE_DIR, 'llasm.js'), readFileSync(llasmSrc));
  }
  
  // index.html - SSR page with client-side hydration
  writeFileSync(join(SITE_DIR, 'index.html'), `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Home - LLasM SSR</title>
</head>
<body class="p3">
  <nav class="f g3 py2 bd" style="border-left:0;border-right:0;border-top:0">
    <a href="/" class="tb c1">Home</a>
    <a href="/about.html" class="cg">About</a>
    <a href="/products.html" class="cg">Products</a>
  </nav>
  
  <main class="xw3 mxa py4">
    <h1 class="t6 tb c1" data-m-bind="title">Loading...</h1>
    <p class="cg py2" data-m-bind="message"></p>
    
    <div class="bg r p3 my3">
      <p class="t2">Server Time: <span class="tb" data-m-bind="serverTime"></span></p>
      <p class="t2">Visit Count: <span class="tb" data-m-bind="visits"></span></p>
    </div>
    
    <div class="f g2 py3">
      <button data-m-on="click:increment" data-m-enhance="primary" class="px3 py2 r">
        Increment
      </button>
      <span class="t4 tb c1" data-m-bind="count">0</span>
    </div>
    
    <p class="t1 cg">State injected by server, client hydration enabled.</p>
  </main>

  <script type="application/llasm+json" id="manifest">{"v":1,"r":{"s":{}},"l":{"en":{}}}</script>
  <script type="module">
    import{l}from"./llasm.js";
    l.h({ increment: (e, s, L) => L.u({ count: s.count + 1 }) });
  </script>
</body>
</html>`);

  // about.html - Static page (no SSR, no client JS)
  writeFileSync(join(SITE_DIR, 'about.html'), `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>About - LLasM SSR</title>
</head>
<body class="p3">
  <nav class="f g3 py2 bd" style="border-left:0;border-right:0;border-top:0">
    <a href="/" class="cg">Home</a>
    <a href="/about.html" class="tb c1">About</a>
    <a href="/products.html" class="cg">Products</a>
  </nav>
  
  <main class="xw3 mxa py4">
    <h1 class="t6 tb c1">About</h1>
    <p class="cg py2">This is a pure static page. No SSR, no client-side JavaScript.</p>
    <p class="cg">It demonstrates that not every page needs server-side state injection.</p>
  </main>
</body>
</html>`);

  // products.html - SSR page without client JS
  writeFileSync(join(SITE_DIR, 'products.html'), `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Products - LLasM SSR</title>
</head>
<body class="p3">
  <nav class="f g3 py2 bd" style="border-left:0;border-right:0;border-top:0">
    <a href="/" class="cg">Home</a>
    <a href="/about.html" class="cg">About</a>
    <a href="/products.html" class="tb c1">Products</a>
  </nav>
  
  <main class="xw3 mxa py4">
    <h1 class="t6 tb c1" data-m-bind="title">Products</h1>
    <p class="cg py2">Showing <span class="tb" data-m-bind="count"></span> products (server-rendered):</p>
    
    <ul data-m-bind="products" data-m-tpl="productTpl" data-m-key="id" class="f fc g2"></ul>
    
    <template id="productTpl">
      <li class="p3 bg r f fb fi">
        <span data-m-f="name" class="tb"></span>
        <span data-m-f="price" class="cg"></span>
      </li>
    </template>
  </main>

  <script type="application/llasm+json" id="manifest">{"v":1,"r":{"s":{}},"l":{"en":{}}}</script>
  <script type="module">import{l}from"./llasm.js";l.h({});</script>
</body>
</html>`);

  console.log(`Created example site at ${SITE_DIR}`);
};

// === SSR HANDLERS ===
// Define which pages get server-side state injection
let visitCount = 0;

const ssrHandlers = {
  '/': async (req) => {
    visitCount++;
    return {
      title: 'Welcome to LLasM SSR',
      message: 'This page was server-side rendered with dynamic state.',
      serverTime: new Date().toISOString(),
      visits: visitCount,
      count: 0
    };
  },
  
  '/products.html': async (req) => {
    // Simulate fetching products from a database
    const products = [
      { id: '1', name: 'Widget A', price: '$9.99' },
      { id: '2', name: 'Widget B', price: '$14.99' },
      { id: '3', name: 'Widget C', price: '$19.99' }
    ];
    return {
      title: 'Our Products',
      products,
      count: products.length
    };
  }
  
  // Note: /about.html has no handler, so it's served as static HTML
};

// === STATE INJECTION ===
const injectState = (html, state) => {
  if (!state) return html;
  const manifest = { v: 1, r: { s: state }, l: { en: {} } };
  return html.replace(
    /<script type="application\/llasm\+json"[^>]*>[\s\S]*?<\/script>/,
    `<script type="application/llasm+json" id="manifest">${JSON.stringify(manifest)}</script>`
  );
};

// === SERVER ===
setupSite();

const server = createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  let path = url.pathname;
  
  // Health check
  if (path === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ status: 'ok', visits: visitCount }));
  }
  
  // Default to index.html
  if (path === '/') path = '/index.html';
  
  // Security: prevent directory traversal
  const safePath = normalize(path).replace(/^(\.\.[\/\\])+/, '');
  const filePath = join(SITE_DIR, safePath);
  
  if (!filePath.startsWith(normalize(SITE_DIR))) {
    res.writeHead(403);
    return res.end('Forbidden');
  }
  
  // Check if file exists
  if (!existsSync(filePath)) {
    res.writeHead(404, { 'Content-Type': 'text/html' });
    return res.end('<h1>404 Not Found</h1>');
  }
  
  const ext = extname(filePath);
  
  // HTML files: check for SSR handler
  if (ext === '.html') {
    const html = readFileSync(filePath, 'utf8');
    const handler = ssrHandlers[path] || ssrHandlers[path.replace('.html', '')];
    
    if (handler) {
      // SSR: inject state
      const state = await handler(req);
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(injectState(html, state));
    } else {
      // Static: serve as-is
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(html);
    }
    return;
  }
  
  // Other files: serve static with caching
  const stat = statSync(filePath);
  res.writeHead(200, {
    'Content-Type': MIME[ext] || 'application/octet-stream',
    'Cache-Control': ext === '.html' ? 'no-cache' : 'public, max-age=31536000'
  });
  createReadStream(filePath).pipe(res);
});

server.listen(PORT, () => {
  console.log(`LLasM SSR server running at http://localhost:${PORT}`);
  console.log(`Site directory: ${SITE_DIR}`);
  console.log('');
  console.log('Pages:');
  console.log('  /              - SSR + client hydration');
  console.log('  /about.html    - Pure static (no SSR)');
  console.log('  /products.html - SSR (server-rendered products)');
  console.log('  /health        - Health check endpoint');
});
