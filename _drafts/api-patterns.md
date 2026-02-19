# LLasM API Patterns Reference

Detailed patterns for building REST APIs with native Node.js.

## Recommended ESM Packages

While LLasM APIs are framework-free, these ESM packages can be used when needed:

| Need | Package | Usage |
|------|---------|-------|
| Database (SQLite) | `better-sqlite3` | `import Database from 'better-sqlite3'` |
| Database (Postgres) | `postgres` | `import postgres from 'postgres'` |
| Validation | `zod` | `import { z } from 'zod'` |
| Validation | `valibot` | `import * as v from 'valibot'` |
| JWT/Auth | `jose` | `import * as jose from 'jose'` |
| Passwords | `bcrypt` | `import bcrypt from 'bcrypt'` |
| Environment | `dotenv` | `import 'dotenv/config'` |

Install with `npm install <package>`, then `node server.js`. No build step.

### Example with SQLite

```javascript
import { createServer } from 'http';
import Database from 'better-sqlite3';

const db = new Database('./data.db');
db.exec(`CREATE TABLE IF NOT EXISTS items (id TEXT PRIMARY KEY, name TEXT, done INTEGER)`);

const routes = {
  'GET /api/items': (req, res) => {
    const items = db.prepare('SELECT * FROM items').all();
    json(res, items);
  },
  'POST /api/items': async (req, res, params, b) => {
    const id = crypto.randomUUID();
    db.prepare('INSERT INTO items (id, name, done) VALUES (?, ?, ?)').run(id, b.name, 0);
    json(res, { id, name: b.name, done: false }, 201);
  }
};
```

### Example with Zod Validation

```javascript
import { z } from 'zod';

const ItemSchema = z.object({
  name: z.string().min(1).max(100),
  done: z.boolean().optional().default(false)
});

'POST /api/items': async (req, res, params, b) => {
  const result = ItemSchema.safeParse(b);
  if (!result.success) {
    return json(res, { error: 'Validation failed', details: result.error.issues }, 400);
  }
  // ... create item with result.data
}
```

## Core Helpers

These helpers should be included in every generated API:

### JSON Response

```javascript
const json = (res, data, status = 200) => {
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
  });
  res.end(JSON.stringify(data));
};
```

### Body Parser

```javascript
const body = (req) => new Promise((resolve, reject) => {
  let d = '';
  req.on('data', c => d += c);
  req.on('end', () => {
    try {
      resolve(d ? JSON.parse(d) : {});
    } catch (e) {
      reject(new Error('Invalid JSON'));
    }
  });
  req.on('error', reject);
});
```

### Route Matcher

```javascript
const match = (pattern, path) => {
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
```

## HTTP Methods

### GET - Retrieve Resources

```javascript
// List all
'GET /api/items': async (req, res) => {
  const data = await loadData();
  json(res, data);
},

// Get one
'GET /api/items/:id': async (req, res, params) => {
  const data = await loadData();
  const item = data.find(i => i.id === params.id);
  item ? json(res, item) : json(res, { error: 'Not found' }, 404);
}
```

### POST - Create Resource

```javascript
'POST /api/items': async (req, res, params, b) => {
  const data = await loadData();
  const item = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    createdAt: new Date().toISOString(),
    ...b
  };
  data.push(item);
  await saveData(data);
  json(res, item, 201);
}
```

### PUT - Update Resource

```javascript
'PUT /api/items/:id': async (req, res, params, b) => {
  const data = await loadData();
  const idx = data.findIndex(i => i.id === params.id);
  if (idx === -1) return json(res, { error: 'Not found' }, 404);
  data[idx] = { ...data[idx], ...b, updatedAt: new Date().toISOString() };
  await saveData(data);
  json(res, data[idx]);
}
```

### PATCH - Partial Update

```javascript
'PATCH /api/items/:id': async (req, res, params, b) => {
  const data = await loadData();
  const idx = data.findIndex(i => i.id === params.id);
  if (idx === -1) return json(res, { error: 'Not found' }, 404);
  Object.assign(data[idx], b, { updatedAt: new Date().toISOString() });
  await saveData(data);
  json(res, data[idx]);
}
```

### DELETE - Remove Resource

```javascript
'DELETE /api/items/:id': async (req, res, params) => {
  let data = await loadData();
  const len = data.length;
  data = data.filter(i => i.id !== params.id);
  if (data.length === len) return json(res, { error: 'Not found' }, 404);
  await saveData(data);
  json(res, { ok: true });
}
```

## CORS Handling

Always include CORS preflight handler:

```javascript
if (req.method === 'OPTIONS') {
  res.writeHead(204, {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400'
  });
  return res.end();
}
```

## Query Parameters

### Pagination

```javascript
'GET /api/items': async (req, res) => {
  const url = new URL(req.url, 'http://localhost');
  const limit = Math.min(parseInt(url.searchParams.get('limit')) || 10, 100);
  const offset = parseInt(url.searchParams.get('offset')) || 0;
  
  const data = await loadData();
  const page = data.slice(offset, offset + limit);
  
  json(res, {
    items: page,
    total: data.length,
    limit,
    offset
  });
}
```

### Filtering

```javascript
'GET /api/items': async (req, res) => {
  const url = new URL(req.url, 'http://localhost');
  let data = await loadData();
  
  const status = url.searchParams.get('status');
  if (status) data = data.filter(i => i.status === status);
  
  const search = url.searchParams.get('q');
  if (search) data = data.filter(i => 
    i.name?.toLowerCase().includes(search.toLowerCase())
  );
  
  json(res, data);
}
```

### Sorting

```javascript
'GET /api/items': async (req, res) => {
  const url = new URL(req.url, 'http://localhost');
  let data = await loadData();
  
  const sort = url.searchParams.get('sort') || 'createdAt';
  const order = url.searchParams.get('order') === 'asc' ? 1 : -1;
  
  data.sort((a, b) => {
    if (a[sort] < b[sort]) return -1 * order;
    if (a[sort] > b[sort]) return 1 * order;
    return 0;
  });
  
  json(res, data);
}
```

## Data Persistence

### File-Based JSON

```javascript
import { readFile, writeFile } from 'fs/promises';

const DATA_FILE = process.env.DATA_FILE || './data.json';

const loadData = async () => {
  try {
    return JSON.parse(await readFile(DATA_FILE, 'utf8'));
  } catch {
    return [];
  }
};

const saveData = async (data) => {
  await writeFile(DATA_FILE, JSON.stringify(data, null, 2));
};
```

### In-Memory (Development)

```javascript
let data = [];

const loadData = async () => data;
const saveData = async (d) => { data = d; };
```

## Validation

### Schema Validation

```javascript
const validate = (body, schema) => {
  const errors = [];
  
  for (const [key, rules] of Object.entries(schema)) {
    const val = body[key];
    
    if (rules.required && (val === undefined || val === null || val === '')) {
      errors.push({ field: key, message: 'required' });
      continue;
    }
    
    if (val !== undefined && rules.type && typeof val !== rules.type) {
      errors.push({ field: key, message: `must be ${rules.type}` });
    }
    
    if (rules.minLength && typeof val === 'string' && val.length < rules.minLength) {
      errors.push({ field: key, message: `min length ${rules.minLength}` });
    }
    
    if (rules.maxLength && typeof val === 'string' && val.length > rules.maxLength) {
      errors.push({ field: key, message: `max length ${rules.maxLength}` });
    }
    
    if (rules.min !== undefined && typeof val === 'number' && val < rules.min) {
      errors.push({ field: key, message: `min ${rules.min}` });
    }
    
    if (rules.max !== undefined && typeof val === 'number' && val > rules.max) {
      errors.push({ field: key, message: `max ${rules.max}` });
    }
    
    if (rules.pattern && typeof val === 'string' && !new RegExp(rules.pattern).test(val)) {
      errors.push({ field: key, message: 'invalid format' });
    }
    
    if (rules.enum && !rules.enum.includes(val)) {
      errors.push({ field: key, message: `must be one of: ${rules.enum.join(', ')}` });
    }
  }
  
  return errors;
};

// Usage
const schema = {
  name: { required: true, type: 'string', minLength: 1, maxLength: 100 },
  email: { required: true, type: 'string', pattern: '^[^@]+@[^@]+\\.[^@]+$' },
  age: { type: 'number', min: 0, max: 150 },
  status: { enum: ['active', 'inactive'] }
};

const errors = validate(b, schema);
if (errors.length) return json(res, { error: 'Validation failed', details: errors }, 400);
```

## Authentication

### Bearer Token

```javascript
const auth = (req) => {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) return null;
  const token = header.slice(7);
  
  // Simple token validation
  if (token === process.env.API_TOKEN) {
    return { user: 'api', role: 'admin' };
  }
  
  return null;
};

// Protected route
'GET /api/admin/users': async (req, res) => {
  const user = auth(req);
  if (!user) return json(res, { error: 'Unauthorized' }, 401);
  if (user.role !== 'admin') return json(res, { error: 'Forbidden' }, 403);
  
  // ... proceed
}
```

### API Key

```javascript
const apiKey = (req) => {
  const key = req.headers['x-api-key'];
  return key === process.env.API_KEY;
};
```

## Error Handling

### Try-Catch Wrapper

```javascript
const safe = (handler) => async (req, res, params, b) => {
  try {
    await handler(req, res, params, b);
  } catch (e) {
    console.error(e);
    json(res, { error: 'Internal server error' }, 500);
  }
};

// Usage
const routes = {
  'GET /api/items': safe(async (req, res) => {
    // ... handler code
  })
};
```

### Error Response Shape

All errors follow this shape:

```javascript
{
  "error": "Human readable message",
  "details": [/* optional array of specific issues */],
  "code": "OPTIONAL_ERROR_CODE"
}
```

## Static File Serving

If needed, serve static files:

```javascript
import { createReadStream, statSync } from 'fs';
import { extname } from 'path';

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

const serveStatic = (res, filePath) => {
  try {
    statSync(filePath);
    const ext = extname(filePath);
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
    createReadStream(filePath).pipe(res);
  } catch {
    json(res, { error: 'Not found' }, 404);
  }
};
```

## Health Check

Always include a health endpoint:

```javascript
'GET /health': (req, res) => {
  json(res, { status: 'ok', timestamp: new Date().toISOString() });
}
```
