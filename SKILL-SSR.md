---
name: llasm-ssr
version: 1.1.0
description: Server-side render LLasM pages with dynamic state injection and file-based routing. Use when the user wants SSR, server rendering, pre-rendered pages, or dynamic HTML generation. Native Node.js with optional ESM packages.
---

# LLasM SSR Generator

Server-side render LLasM pages with pre-populated state. Output is a single JavaScript file that runs directly with `node ssr-server.js`.

## Philosophy: No Build, Not No Packages

LLasM SSR is **framework-free**, not dependency-free:

- ✅ Native `http` module (no Express/Fastify/Hono)
- ✅ ESM packages that don't require compilation
- ✅ `npm install` → `node ssr-server.js` (no build step)
- ❌ TypeScript (requires compilation)
- ❌ Template engines (EJS, Pug, Handlebars)
- ❌ Bundlers or transpilers

### Recommended ESM Packages

| Need | Package | Why |
|------|---------|-----|
| Database | `better-sqlite3`, `postgres` | Data fetching for SSR |
| Markdown | `marked` | Render markdown content |
| Syntax highlighting | `shiki` | Code blocks |
| Date formatting | `date-fns` | Lightweight date utils |

**Default to native.** Only add packages when needed.

## File-Based Routing

LLasM SSR supports **file-based routing** where each HTML file in your site directory can be served with optional SSR state injection:

```
site/
├── index.html        ← SSR: inject dynamic data
├── about.html        ← Static: serve as-is
├── products.html     ← SSR: fetch products, inject state
├── contact.html      ← Static with client-side JS
└── llasm.js          ← Runtime (copied here)
```

Each page is self-contained. Links between pages just work (`<a href="/about.html">`).

## Output Structure

```javascript
// ssr-server.js
import { createServer } from 'http';
import { readFileSync, existsSync, createReadStream, statSync } from 'fs';
import { extname, join, normalize } from 'path';

// === CONFIG ===
const PORT = process.env.PORT || 3000;
const SITE_DIR = process.env.SITE_DIR || './site';

// === MIME TYPES ===
const MIME = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

// === SSR HANDLERS ===
// Define which pages get SSR state injection
const ssrHandlers = {
  '/': async (req) => ({ 
    message: 'Hello from SSR!', 
    timestamp: Date.now() 
  }),
  '/products.html': async (req) => {
    const products = await fetchProducts(); // your data fetching
    return { products, count: products.length };
  }
};

// === RENDER ===
const injectState = (html, state) => {
  if (!state) return html; // No SSR, serve as-is
  const manifest = { v: 1, r: { s: state }, l: { en: {} } };
  return html.replace(
    /<script type="application\/llasm\+json"[^>]*>[\s\S]*?<\/script>/,
    `<script type="application/llasm+json" id="manifest">${JSON.stringify(manifest)}</script>`
  );
};

// === SERVER ===
const server = createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  let path = url.pathname;
  
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

server.listen(PORT, () => console.log(`http://localhost:${PORT}`));
```

## Critical Rules

1. **Single file** - Everything in one `ssr-server.js` file
2. **Framework-free** - Native `http` module, no Express/Fastify
3. **ESM only** - Use `import`, not `require`
4. **File-based routing** - HTML files in directory = routes
5. **Selective SSR** - Only pages with handlers get state injection
6. **No build step** - Code runs directly

## Template Requirements

The HTML template must be a valid LLasM page with a manifest placeholder:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>SSR Page</title>
</head>
<body class="p3">
  <h1 data-m-bind="title"></h1>
  <p data-m-bind="message"></p>
  
  <!-- This will be replaced by SSR -->
  <script type="application/llasm+json" id="manifest">{"v":1,"r":{"s":{}},"l":{"en":{}}}</script>
  
  <script type="module">
    import{l}from"./llasm.js";
    l.h({});
  </script>
</body>
</html>
```

## State Injection

The `render()` function replaces the manifest with server-side state:

```javascript
const render = (state, locale = 'en') => {
  const manifest = {
    v: 1,
    r: { s: state },
    l: { [locale]: {} },
    t: { '--m-p': '#0066ff' }
  };
  return template.replace(
    /<script type="application\/llasm\+json"[^>]*>[\s\S]*?<\/script>/,
    `<script type="application/llasm+json" id="manifest">${JSON.stringify(manifest)}</script>`
  );
};
```

## Dynamic Routes

Handle URL parameters:

```javascript
const matchRoute = (pattern, path) => {
  const pParts = pattern.split('/');
  const uParts = path.split('/');
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

// Usage
const routes = {
  '/users/:id': async (req, res, params) => {
    const user = await fetchUser(params.id);
    const state = { user };
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(render(state));
  }
};
```

## Data Fetching

Fetch data before rendering:

```javascript
'/products': async (req, res) => {
  // Fetch from API or database
  const products = await fetchProducts();
  
  const state = {
    products,
    count: products.length,
    fetchedAt: new Date().toISOString()
  };
  
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(render(state));
}
```

## Multiple Templates

Use different templates for different pages:

```javascript
const templates = {
  home: readFileSync('./templates/home.html', 'utf8'),
  about: readFileSync('./templates/about.html', 'utf8'),
  product: readFileSync('./templates/product.html', 'utf8')
};

const renderWith = (templateName, state) => {
  const tpl = templates[templateName];
  const manifest = { v: 1, r: { s: state }, l: { en: {} } };
  return tpl.replace(
    /<script type="application\/llasm\+json"[^>]*>[\s\S]*?<\/script>/,
    `<script type="application/llasm+json" id="manifest">${JSON.stringify(manifest)}</script>`
  );
};
```

## i18n Support

Inject locale-specific translations:

```javascript
const locales = {
  en: { title: 'Welcome', greeting: 'Hello' },
  es: { title: 'Bienvenido', greeting: 'Hola' },
  fr: { title: 'Bienvenue', greeting: 'Bonjour' }
};

const renderLocalized = (state, locale = 'en') => {
  const manifest = {
    v: 1,
    r: { s: state },
    l: { [locale]: locales[locale] || locales.en }
  };
  return template.replace(
    /<script type="application\/llasm\+json"[^>]*>[\s\S]*?<\/script>/,
    `<script type="application/llasm+json" id="manifest">${JSON.stringify(manifest)}</script>`
  );
};

// Detect locale from request
const getLocale = (req) => {
  const accept = req.headers['accept-language'] || '';
  if (accept.includes('es')) return 'es';
  if (accept.includes('fr')) return 'fr';
  return 'en';
};
```

## SEO Meta Tags

Inject dynamic meta tags:

```javascript
const renderWithMeta = (state, meta) => {
  let html = template;
  
  // Replace title
  if (meta.title) {
    html = html.replace(/<title>.*?<\/title>/, `<title>${meta.title}</title>`);
  }
  
  // Replace description
  if (meta.description) {
    html = html.replace(
      /<meta name="description"[^>]*>/,
      `<meta name="description" content="${meta.description}">`
    );
  }
  
  // Inject manifest
  const manifest = { v: 1, r: { s: state }, l: { en: {} } };
  html = html.replace(
    /<script type="application\/llasm\+json"[^>]*>[\s\S]*?<\/script>/,
    `<script type="application/llasm+json" id="manifest">${JSON.stringify(manifest)}</script>`
  );
  
  return html;
};
```

## Error Pages

Handle errors gracefully:

```javascript
const errorTemplate = readFileSync('./templates/error.html', 'utf8');

const renderError = (status, message) => {
  const state = { status, message };
  const manifest = { v: 1, r: { s: state }, l: { en: {} } };
  return errorTemplate.replace(
    /<script type="application\/llasm\+json"[^>]*>[\s\S]*?<\/script>/,
    `<script type="application/llasm+json" id="manifest">${JSON.stringify(manifest)}</script>`
  );
};

// Usage
try {
  // ... route handling
} catch (e) {
  res.writeHead(500, { 'Content-Type': 'text/html' });
  res.end(renderError(500, 'Internal Server Error'));
}
```

## Caching

Add cache headers for static content:

```javascript
const serveStatic = (res, filePath) => {
  try {
    const fullPath = join(STATIC_DIR, filePath);
    const stat = statSync(fullPath);
    const ext = extname(fullPath);
    
    res.writeHead(200, {
      'Content-Type': MIME[ext] || 'application/octet-stream',
      'Cache-Control': 'public, max-age=31536000',
      'Last-Modified': stat.mtime.toUTCString()
    });
    
    createReadStream(fullPath).pipe(res);
    return true;
  } catch {
    return false;
  }
};
```

## Running the Server

```bash
node ssr-server.js
# or with custom port
PORT=8080 node ssr-server.js
```

## What NOT to Include

- No Express, Fastify, Hono, or any HTTP framework
- No template engines (EJS, Pug, Handlebars, Nunjucks)
- No TypeScript (requires compilation)
- No build step (no bundlers, no transpilers)
- No React/Vue/Svelte server components

## What IS Allowed

- ESM packages from the recommended list above
- Any pure-ESM package that doesn't require compilation
- Native Node.js modules (`http`, `fs`, `crypto`, `path`, etc.)
- File-based routing with mixed static/SSR pages

Just ensure: `npm install` → `node ssr-server.js` works with no steps between.

## Page Types in File-Based Routing

Each HTML file in your site can be one of:

| Type | Has Handler? | Has llasm.js? | Description |
|------|-------------|---------------|-------------|
| Pure Static | No | No | Plain HTML, no JS |
| Static + Client | No | Yes | Client-side reactivity only |
| SSR | Yes | Optional | Server injects state |
| SSR + Client | Yes | Yes | Server state + client hydration |

All pages can link to each other normally. The server decides per-request whether to inject state.

## Examples

See working examples:
- [docs/examples/ssr-basic.js](docs/examples/ssr-basic.js) - File-based SSR server
- [docs/examples/ssr-with-api.js](docs/examples/ssr-with-api.js) - Combined SSR + API
