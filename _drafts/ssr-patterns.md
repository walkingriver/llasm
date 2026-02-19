# LLasM SSR Patterns Reference

Detailed patterns for server-side rendering LLasM pages with native Node.js.

## Recommended ESM Packages

While LLasM SSR is framework-free, these ESM packages can be used when needed:

| Need | Package | Usage |
|------|---------|-------|
| Database | `better-sqlite3` | `import Database from 'better-sqlite3'` |
| Database | `postgres` | `import postgres from 'postgres'` |
| Markdown | `marked` | `import { marked } from 'marked'` |
| Syntax | `shiki` | `import { codeToHtml } from 'shiki'` |
| Dates | `date-fns` | `import { format } from 'date-fns'` |
| Validation | `zod` | `import { z } from 'zod'` |

Install with `npm install <package>`, then `node ssr-server.js`. No build step.

## Core Rendering

### Basic State Injection

```javascript
import { readFileSync } from 'fs';

const template = readFileSync('./index.html', 'utf8');

const render = (state) => {
  const manifest = {
    v: 1,
    r: { s: state },
    l: { en: {} }
  };
  
  return template.replace(
    /<script type="application\/llasm\+json"[^>]*>[\s\S]*?<\/script>/,
    `<script type="application/llasm+json" id="manifest">${JSON.stringify(manifest)}</script>`
  );
};
```

### With Theme and Locale

```javascript
const render = (state, options = {}) => {
  const { locale = 'en', theme = {}, translations = {} } = options;
  
  const manifest = {
    v: 1,
    r: { s: state },
    l: { [locale]: translations },
    t: { '--m-p': '#0066ff', ...theme }
  };
  
  return template.replace(
    /<script type="application\/llasm\+json"[^>]*>[\s\S]*?<\/script>/,
    `<script type="application/llasm+json" id="manifest">${JSON.stringify(manifest)}</script>`
  );
};
```

### With Persistence Config

```javascript
const render = (state, persistKeys = []) => {
  const manifest = {
    v: 1,
    r: { s: state },
    persist: persistKeys,
    l: { en: {} }
  };
  
  return template.replace(
    /<script type="application\/llasm\+json"[^>]*>[\s\S]*?<\/script>/,
    `<script type="application/llasm+json" id="manifest">${JSON.stringify(manifest)}</script>`
  );
};

// Usage - persist user preferences client-side
render({ user: { name: 'Alice' }, theme: 'dark' }, ['theme']);
```

## Static File Serving

### Complete Static Server

```javascript
import { createReadStream, statSync, existsSync } from 'fs';
import { extname, join, normalize } from 'path';

const STATIC_DIR = './public';

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.pdf': 'application/pdf'
};

const serveStatic = (res, requestPath) => {
  // Prevent directory traversal
  const safePath = normalize(requestPath).replace(/^(\.\.[\/\\])+/, '');
  const fullPath = join(STATIC_DIR, safePath);
  
  // Check if within STATIC_DIR
  if (!fullPath.startsWith(normalize(STATIC_DIR))) {
    return false;
  }
  
  try {
    const stat = statSync(fullPath);
    if (!stat.isFile()) return false;
    
    const ext = extname(fullPath).toLowerCase();
    const contentType = MIME[ext] || 'application/octet-stream';
    
    res.writeHead(200, {
      'Content-Type': contentType,
      'Content-Length': stat.size,
      'Cache-Control': 'public, max-age=31536000, immutable',
      'Last-Modified': stat.mtime.toUTCString()
    });
    
    createReadStream(fullPath).pipe(res);
    return true;
  } catch {
    return false;
  }
};
```

### Conditional Caching

```javascript
const serveStaticWithEtag = (req, res, requestPath) => {
  const fullPath = join(STATIC_DIR, requestPath);
  
  try {
    const stat = statSync(fullPath);
    const etag = `"${stat.size}-${stat.mtime.getTime()}"`;
    
    // Check if client has cached version
    if (req.headers['if-none-match'] === etag) {
      res.writeHead(304);
      res.end();
      return true;
    }
    
    const ext = extname(fullPath).toLowerCase();
    res.writeHead(200, {
      'Content-Type': MIME[ext] || 'application/octet-stream',
      'ETag': etag,
      'Cache-Control': 'public, max-age=86400'
    });
    
    createReadStream(fullPath).pipe(res);
    return true;
  } catch {
    return false;
  }
};
```

## Routing Patterns

### Static Routes

```javascript
const routes = {
  '/': (req, res) => renderPage('home', {}),
  '/about': (req, res) => renderPage('about', { page: 'about' }),
  '/contact': (req, res) => renderPage('contact', { page: 'contact' })
};
```

### Dynamic Routes with Params

```javascript
const matchRoute = (pattern, path) => {
  const pParts = pattern.split('/').filter(Boolean);
  const uParts = path.split('/').filter(Boolean);
  
  if (pParts.length !== uParts.length) return null;
  
  const params = {};
  for (let i = 0; i < pParts.length; i++) {
    if (pParts[i].startsWith(':')) {
      params[pParts[i].slice(1)] = decodeURIComponent(uParts[i]);
    } else if (pParts[i] !== uParts[i]) {
      return null;
    }
  }
  return params;
};

const dynamicRoutes = [
  { pattern: '/users/:id', handler: renderUserPage },
  { pattern: '/products/:category/:id', handler: renderProductPage },
  { pattern: '/blog/:year/:month/:slug', handler: renderBlogPost }
];

// In router
for (const { pattern, handler } of dynamicRoutes) {
  const params = matchRoute(pattern, path);
  if (params) {
    return handler(req, res, params);
  }
}
```

### Wildcard Routes

```javascript
// Catch-all for SPA-style routing
const handleRequest = (req, res) => {
  const path = new URL(req.url, 'http://localhost').pathname;
  
  // Try static file
  if (serveStatic(res, path)) return;
  
  // Try exact route
  if (routes[path]) return routes[path](req, res);
  
  // Try dynamic routes
  for (const { pattern, handler } of dynamicRoutes) {
    const params = matchRoute(pattern, path);
    if (params) return handler(req, res, params);
  }
  
  // Fallback: render index with client-side routing
  const state = { route: path };
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(render(state));
};
```

## File-Based Routing

The preferred approach for LLasM SSR is file-based routing, where each HTML file in your site directory is a potential route.

### Directory Structure

```
site/
├── index.html        ← /
├── about.html        ← /about.html
├── contact.html      ← /contact.html
├── products/
│   ├── index.html    ← /products/ or /products/index.html
│   └── detail.html   ← /products/detail.html
└── llasm.js
```

### SSR Handlers Map

Define which pages get server-side state injection:

```javascript
// SSR handlers - pages not listed are served as static HTML
const ssrHandlers = {
  '/': async (req) => ({
    greeting: 'Welcome!',
    timestamp: Date.now()
  }),
  
  '/products.html': async (req) => {
    const products = await loadProducts();
    return { products, count: products.length };
  },
  
  '/products/detail.html': async (req) => {
    const url = new URL(req.url, 'http://localhost');
    const id = url.searchParams.get('id');
    const product = await loadProduct(id);
    return { product };
  }
};
```

### Complete File-Based Server

```javascript
import { createServer } from 'http';
import { readFileSync, existsSync, createReadStream, statSync } from 'fs';
import { extname, join, normalize } from 'path';

const PORT = process.env.PORT || 3000;
const SITE_DIR = './site';

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

// SSR handlers
const ssrHandlers = {
  '/': async () => ({ message: 'Hello!', time: Date.now() }),
  '/products.html': async () => ({ products: await loadProducts() })
};

// State injection
const injectState = (html, state) => {
  if (!state) return html;
  const manifest = { v: 1, r: { s: state }, l: { en: {} } };
  return html.replace(
    /<script type="application\/llasm\+json"[^>]*>[\s\S]*?<\/script>/,
    `<script type="application/llasm+json" id="manifest">${JSON.stringify(manifest)}</script>`
  );
};

const server = createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  let path = url.pathname;
  
  // Default index
  if (path === '/') path = '/index.html';
  if (path.endsWith('/')) path += 'index.html';
  
  // Security
  const safePath = normalize(path).replace(/^(\.\.[\/\\])+/, '');
  const filePath = join(SITE_DIR, safePath);
  
  if (!filePath.startsWith(normalize(SITE_DIR))) {
    res.writeHead(403);
    return res.end('Forbidden');
  }
  
  if (!existsSync(filePath)) {
    res.writeHead(404, { 'Content-Type': 'text/html' });
    return res.end('<h1>404</h1>');
  }
  
  const ext = extname(filePath);
  
  if (ext === '.html') {
    const html = readFileSync(filePath, 'utf8');
    const handler = ssrHandlers[path] || ssrHandlers[path.replace('.html', '')];
    const state = handler ? await handler(req) : null;
    
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(injectState(html, state));
  } else {
    res.writeHead(200, {
      'Content-Type': MIME[ext] || 'application/octet-stream',
      'Cache-Control': 'public, max-age=31536000'
    });
    createReadStream(filePath).pipe(res);
  }
});

server.listen(PORT, () => console.log(`http://localhost:${PORT}`));
```

### Page Types

| Route | Has Handler | Has llasm.js | Result |
|-------|-------------|--------------|--------|
| `/about.html` | No | No | Pure static HTML |
| `/contact.html` | No | Yes | Static + client JS |
| `/` | Yes | No | SSR only (no hydration) |
| `/products.html` | Yes | Yes | SSR + client hydration |

### Query Parameters for Dynamic Pages

```javascript
'/products/detail.html': async (req) => {
  const url = new URL(req.url, 'http://localhost');
  const id = url.searchParams.get('id');
  
  if (!id) return { error: 'No product ID' };
  
  const product = await loadProduct(id);
  return product ? { product } : { error: 'Not found' };
}
```

Links work naturally: `<a href="/products/detail.html?id=123">View Product</a>`

## Data Fetching

### From External API

```javascript
const fetchData = async (url) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
};

'/products': async (req, res) => {
  try {
    const products = await fetchData('https://api.example.com/products');
    const state = { products, count: products.length };
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(render(state));
  } catch (e) {
    res.writeHead(500, { 'Content-Type': 'text/html' });
    res.end(renderError(500, 'Failed to fetch products'));
  }
}
```

### From File Database

```javascript
import { readFile } from 'fs/promises';

const loadData = async (file) => {
  try {
    return JSON.parse(await readFile(file, 'utf8'));
  } catch {
    return [];
  }
};

'/users/:id': async (req, res, params) => {
  const users = await loadData('./data/users.json');
  const user = users.find(u => u.id === params.id);
  
  if (!user) {
    res.writeHead(404, { 'Content-Type': 'text/html' });
    return res.end(renderError(404, 'User not found'));
  }
  
  const state = { user };
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(render(state));
}
```

### With Caching

```javascript
const cache = new Map();
const CACHE_TTL = 60000; // 1 minute

const fetchCached = async (key, fetcher) => {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.time < CACHE_TTL) {
    return cached.data;
  }
  
  const data = await fetcher();
  cache.set(key, { data, time: Date.now() });
  return data;
};

'/products': async (req, res) => {
  const products = await fetchCached('products', () => 
    fetchData('https://api.example.com/products')
  );
  
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(render({ products }));
}
```

## SEO and Meta Tags

### Dynamic Title and Description

```javascript
const injectMeta = (html, meta) => {
  let result = html;
  
  if (meta.title) {
    result = result.replace(/<title>.*?<\/title>/, `<title>${escapeHtml(meta.title)}</title>`);
  }
  
  if (meta.description) {
    // Replace existing or inject new
    if (result.includes('name="description"')) {
      result = result.replace(
        /<meta name="description"[^>]*>/,
        `<meta name="description" content="${escapeHtml(meta.description)}">`
      );
    } else {
      result = result.replace(
        '</head>',
        `<meta name="description" content="${escapeHtml(meta.description)}">\n</head>`
      );
    }
  }
  
  return result;
};

const escapeHtml = (str) => str
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;');
```

### Open Graph Tags

```javascript
const injectOG = (html, og) => {
  const tags = [];
  
  if (og.title) tags.push(`<meta property="og:title" content="${escapeHtml(og.title)}">`);
  if (og.description) tags.push(`<meta property="og:description" content="${escapeHtml(og.description)}">`);
  if (og.image) tags.push(`<meta property="og:image" content="${og.image}">`);
  if (og.url) tags.push(`<meta property="og:url" content="${og.url}">`);
  tags.push(`<meta property="og:type" content="${og.type || 'website'}">`);
  
  return html.replace('</head>', `${tags.join('\n')}\n</head>`);
};
```

### Canonical URL

```javascript
const injectCanonical = (html, url) => {
  return html.replace(
    '</head>',
    `<link rel="canonical" href="${url}">\n</head>`
  );
};
```

## Internationalization

### Locale Detection

```javascript
const detectLocale = (req) => {
  // Check URL parameter
  const url = new URL(req.url, 'http://localhost');
  const langParam = url.searchParams.get('lang');
  if (langParam && ['en', 'es', 'fr', 'de'].includes(langParam)) {
    return langParam;
  }
  
  // Check Accept-Language header
  const accept = req.headers['accept-language'] || '';
  const langs = accept.split(',').map(l => l.split(';')[0].trim().slice(0, 2));
  
  for (const lang of langs) {
    if (['en', 'es', 'fr', 'de'].includes(lang)) {
      return lang;
    }
  }
  
  return 'en';
};
```

### Translation Loading

```javascript
import { readFileSync } from 'fs';

const translations = {};
for (const lang of ['en', 'es', 'fr', 'de']) {
  try {
    translations[lang] = JSON.parse(
      readFileSync(`./locales/${lang}.json`, 'utf8')
    );
  } catch {
    translations[lang] = {};
  }
}

const renderLocalized = (state, locale) => {
  const manifest = {
    v: 1,
    r: { s: state },
    l: { [locale]: translations[locale] || {} }
  };
  
  return template.replace(
    /<script type="application\/llasm\+json"[^>]*>[\s\S]*?<\/script>/,
    `<script type="application/llasm+json" id="manifest">${JSON.stringify(manifest)}</script>`
  );
};
```

## Error Handling

### Error Templates

```javascript
const errorTemplates = {
  404: readFileSync('./templates/404.html', 'utf8'),
  500: readFileSync('./templates/500.html', 'utf8')
};

const renderError = (status, message) => {
  const tpl = errorTemplates[status] || errorTemplates[500];
  const manifest = { v: 1, r: { s: { status, message } }, l: { en: {} } };
  
  return tpl.replace(
    /<script type="application\/llasm\+json"[^>]*>[\s\S]*?<\/script>/,
    `<script type="application/llasm+json" id="manifest">${JSON.stringify(manifest)}</script>`
  );
};
```

### Global Error Handler

```javascript
const server = createServer(async (req, res) => {
  try {
    await handleRequest(req, res);
  } catch (e) {
    console.error('Request error:', e);
    
    if (!res.headersSent) {
      res.writeHead(500, { 'Content-Type': 'text/html' });
      res.end(renderError(500, 'Internal Server Error'));
    }
  }
});
```

## Performance

### Response Compression

```javascript
import { createGzip, createDeflate } from 'zlib';

const compress = (req, res, content) => {
  const encoding = req.headers['accept-encoding'] || '';
  
  if (encoding.includes('gzip')) {
    res.setHeader('Content-Encoding', 'gzip');
    const gzip = createGzip();
    gzip.pipe(res);
    gzip.end(content);
  } else if (encoding.includes('deflate')) {
    res.setHeader('Content-Encoding', 'deflate');
    const deflate = createDeflate();
    deflate.pipe(res);
    deflate.end(content);
  } else {
    res.end(content);
  }
};

// Usage
res.writeHead(200, { 'Content-Type': 'text/html' });
compress(req, res, render(state));
```

### Template Caching

```javascript
// Cache compiled templates in production
const templateCache = new Map();

const getTemplate = (name) => {
  if (process.env.NODE_ENV === 'production' && templateCache.has(name)) {
    return templateCache.get(name);
  }
  
  const content = readFileSync(`./templates/${name}.html`, 'utf8');
  templateCache.set(name, content);
  return content;
};
```

## Health Check

Always include a health endpoint:

```javascript
'/health': (req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  }));
}
```
