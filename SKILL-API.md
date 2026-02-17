---
name: llasm-api
version: 1.1.0
description: Generate REST APIs using native Node.js with optional ESM packages. Use when the user wants to build a backend API, REST service, JSON endpoints, or server-side data layer. No Express, no Fastify - just native Node.js http module with curated dependencies.
---

# LLasM API Generator

Generate production-ready REST APIs with native Node.js. Output is a single JavaScript file that runs directly with `node server.js`.

## Philosophy: No Build, Not No Packages

LLasM APIs are **framework-free**, not dependency-free:

- ✅ Native `http` module (no Express/Fastify/Hono)
- ✅ ESM packages that don't require compilation
- ✅ `npm install` → `node server.js` (no build step between)
- ❌ TypeScript (requires compilation)
- ❌ Bundlers (webpack, rollup, vite)
- ❌ Frameworks with middleware chains

### Recommended ESM Packages

Use these when native solutions are insufficient:

| Need | Package | Why |
|------|---------|-----|
| Database (SQLite) | `better-sqlite3` | Sync API, zero config |
| Database (Postgres) | `postgres` | Pure JS, modern API |
| Validation | `zod` or `valibot` | Type-safe, tiny |
| JWT/Auth | `jose` | Standards-compliant, no deps |
| Environment | `dotenv` | Load .env files |
| Hashing | `bcrypt` | Password hashing |
| UUID | `crypto.randomUUID()` | **Built-in** (Node 19+) |

**Default to native.** Only add packages when they provide significant value over hand-rolled solutions.

## Output Structure

Every LLasM API has exactly one file:

```javascript
// server.js
import { createServer } from 'http';
import { readFile, writeFile } from 'fs/promises';

// === CONFIG ===
const PORT = process.env.PORT || 3000;
const DATA_FILE = './data.json';

// === HELPERS ===
const json = (res, data, status = 200) => {
  res.writeHead(status, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
  res.end(JSON.stringify(data));
};

const body = (req) => new Promise((resolve) => {
  let d = '';
  req.on('data', c => d += c);
  req.on('end', () => resolve(d ? JSON.parse(d) : {}));
});

const match = (pattern, path) => {
  const pParts = pattern.split('/');
  const uParts = path.split('/');
  if (pParts.length !== uParts.length) return null;
  const params = {};
  for (let i = 0; i < pParts.length; i++) {
    if (pParts[i].startsWith(':')) params[pParts[i].slice(1)] = uParts[i];
    else if (pParts[i] !== uParts[i]) return null;
  }
  return params;
};

// === ROUTES ===
const routes = {
  'GET /api/items': async (req, res) => {
    const data = JSON.parse(await readFile(DATA_FILE, 'utf8').catch(() => '[]'));
    json(res, data);
  },
  'POST /api/items': async (req, res, params, b) => {
    const data = JSON.parse(await readFile(DATA_FILE, 'utf8').catch(() => '[]'));
    const item = { id: Date.now().toString(36), ...b };
    data.push(item);
    await writeFile(DATA_FILE, JSON.stringify(data, null, 2));
    json(res, item, 201);
  },
  'GET /api/items/:id': async (req, res, params) => {
    const data = JSON.parse(await readFile(DATA_FILE, 'utf8').catch(() => '[]'));
    const item = data.find(i => i.id === params.id);
    item ? json(res, item) : json(res, { error: 'Not found' }, 404);
  },
  'DELETE /api/items/:id': async (req, res, params) => {
    let data = JSON.parse(await readFile(DATA_FILE, 'utf8').catch(() => '[]'));
    data = data.filter(i => i.id !== params.id);
    await writeFile(DATA_FILE, JSON.stringify(data, null, 2));
    json(res, { ok: true });
  }
};

// === SERVER ===
const server = createServer(async (req, res) => {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
    return res.end();
  }

  const url = new URL(req.url, `http://localhost:${PORT}`);
  const path = url.pathname;
  const method = req.method;

  // Try exact match first
  const exactKey = `${method} ${path}`;
  if (routes[exactKey]) {
    const b = await body(req);
    return routes[exactKey](req, res, {}, b);
  }

  // Try parameterized routes
  for (const [pattern, handler] of Object.entries(routes)) {
    const [m, p] = pattern.split(' ');
    if (m !== method) continue;
    const params = match(p, path);
    if (params) {
      const b = await body(req);
      return handler(req, res, params, b);
    }
  }

  json(res, { error: 'Not found' }, 404);
});

server.listen(PORT, () => console.log(`http://localhost:${PORT}`));
```

## Critical Rules

1. **Single file** - Everything in one `server.js` file
2. **Framework-free** - Native `http` module, no Express/Fastify/Hono
3. **ESM only** - Use `import`, not `require`
4. **No build step** - Code runs directly with `node server.js`
5. **CORS enabled** - Always include CORS headers
6. **JSON responses** - All responses are JSON with consistent shape

## Route Definition

Routes are defined as an object with `METHOD /path` keys:

```javascript
const routes = {
  'GET /api/users': handler,
  'POST /api/users': handler,
  'GET /api/users/:id': handler,
  'PUT /api/users/:id': handler,
  'DELETE /api/users/:id': handler,
};
```

## Handler Signature

```javascript
async (req, res, params, body) => {
  // req    - Node.js IncomingMessage
  // res    - Node.js ServerResponse
  // params - URL parameters { id: '123' }
  // body   - Parsed JSON body {}
}
```

## Response Helpers

| Helper | Purpose |
|--------|---------|
| `json(res, data, status)` | Send JSON response |
| `body(req)` | Parse JSON request body |
| `match(pattern, path)` | Extract URL params |

## Data Persistence

For simple persistence, use file-based JSON:

```javascript
import { readFile, writeFile } from 'fs/promises';

const DATA_FILE = './data.json';

// Read
const data = JSON.parse(await readFile(DATA_FILE, 'utf8').catch(() => '[]'));

// Write
await writeFile(DATA_FILE, JSON.stringify(data, null, 2));
```

For more complex needs, document that the user should add their own database.

## Error Handling

Return consistent error shape:

```javascript
json(res, { error: 'Not found' }, 404);
json(res, { error: 'Invalid input', details: [...] }, 400);
json(res, { error: 'Unauthorized' }, 401);
json(res, { error: 'Internal error' }, 500);
```

## Environment Variables

Use `process.env` with defaults:

```javascript
const PORT = process.env.PORT || 3000;
const DATA_FILE = process.env.DATA_FILE || './data.json';
```

## Running the Server

```bash
node server.js
# or with custom port
PORT=8080 node server.js
```

## Common Patterns

### Authentication (Basic)

```javascript
const auth = (req) => {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) return null;
  const token = header.slice(7);
  // Validate token (user's responsibility)
  return token === process.env.API_TOKEN ? { user: 'admin' } : null;
};

// In handler
'GET /api/protected': async (req, res) => {
  const user = auth(req);
  if (!user) return json(res, { error: 'Unauthorized' }, 401);
  // ... proceed
}
```

### Validation

```javascript
const validate = (body, schema) => {
  const errors = [];
  for (const [key, rules] of Object.entries(schema)) {
    if (rules.required && !body[key]) errors.push(`${key} is required`);
    if (rules.type && typeof body[key] !== rules.type) errors.push(`${key} must be ${rules.type}`);
  }
  return errors;
};

// In handler
const errors = validate(b, { name: { required: true, type: 'string' } });
if (errors.length) return json(res, { error: 'Invalid input', details: errors }, 400);
```

### Query Parameters

```javascript
'GET /api/items': async (req, res) => {
  const url = new URL(req.url, 'http://localhost');
  const limit = parseInt(url.searchParams.get('limit')) || 10;
  const offset = parseInt(url.searchParams.get('offset')) || 0;
  // ... use limit/offset
}
```

## What NOT to Include

- No Express, Fastify, Hono, or any HTTP framework
- No TypeScript (requires compilation)
- No build step (no bundlers, no transpilers)
- No middleware chains or plugin systems
- No ORMs (use direct database drivers)

## What IS Allowed

- ESM packages from the recommended list above
- Any pure-ESM package that doesn't require compilation
- Native Node.js modules (`http`, `fs`, `crypto`, `path`, etc.)

Just ensure: `npm install` → `node server.js` works with no steps between.

## Examples

See working examples:
- [docs/examples/api-basic.js](docs/examples/api-basic.js) - Simple CRUD
- [docs/examples/api-with-db.js](docs/examples/api-with-db.js) - File-based persistence
