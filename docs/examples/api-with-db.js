/**
 * LLasM API Example: File-Based JSON Persistence
 * 
 * Run: node api-with-db.js
 * Test: curl http://localhost:3000/api/todos
 * 
 * Data is persisted to ./todos.json
 */
import { createServer } from 'http';
import { readFile, writeFile } from 'fs/promises';

// === CONFIG ===
const PORT = process.env.PORT || 3000;
const DATA_FILE = process.env.DATA_FILE || './todos.json';

// === DATA HELPERS ===
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

// === HTTP HELPERS ===
const json = (res, data, status = 200) => {
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
  });
  res.end(JSON.stringify(data));
};

const body = (req) => new Promise((resolve, reject) => {
  let d = '';
  req.on('data', c => d += c);
  req.on('end', () => {
    try {
      resolve(d ? JSON.parse(d) : {});
    } catch {
      reject(new Error('Invalid JSON'));
    }
  });
});

const match = (pattern, path) => {
  const pParts = pattern.split('/');
  const uParts = path.split('/');
  if (pParts.length !== uParts.length) return null;
  const params = {};
  for (let i = 0; i < pParts.length; i++) {
    if (pParts[i].startsWith(':')) params[pParts[i].slice(1)] = decodeURIComponent(uParts[i]);
    else if (pParts[i] !== uParts[i]) return null;
  }
  return params;
};

const genId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

// === VALIDATION ===
const validate = (body, schema) => {
  const errors = [];
  for (const [key, rules] of Object.entries(schema)) {
    const val = body[key];
    if (rules.required && (val === undefined || val === null || val === '')) {
      errors.push({ field: key, message: 'required' });
    }
    if (val !== undefined && rules.type && typeof val !== rules.type) {
      errors.push({ field: key, message: `must be ${rules.type}` });
    }
    if (rules.maxLength && typeof val === 'string' && val.length > rules.maxLength) {
      errors.push({ field: key, message: `max length ${rules.maxLength}` });
    }
  }
  return errors;
};

// === ROUTES ===
const routes = {
  // Health check
  'GET /health': (req, res) => {
    json(res, { status: 'ok', timestamp: new Date().toISOString(), dataFile: DATA_FILE });
  },

  // List all todos with optional filtering
  'GET /api/todos': async (req, res) => {
    const url = new URL(req.url, 'http://localhost');
    let data = await loadData();
    
    // Filter by completion status
    const completed = url.searchParams.get('completed');
    if (completed !== null) {
      data = data.filter(t => t.completed === (completed === 'true'));
    }
    
    // Search by title
    const q = url.searchParams.get('q');
    if (q) {
      data = data.filter(t => t.title.toLowerCase().includes(q.toLowerCase()));
    }
    
    // Pagination
    const limit = Math.min(parseInt(url.searchParams.get('limit')) || 50, 100);
    const offset = parseInt(url.searchParams.get('offset')) || 0;
    const total = data.length;
    data = data.slice(offset, offset + limit);
    
    json(res, { items: data, total, limit, offset });
  },

  // Get single todo
  'GET /api/todos/:id': async (req, res, params) => {
    const data = await loadData();
    const todo = data.find(t => t.id === params.id);
    todo ? json(res, todo) : json(res, { error: 'Not found' }, 404);
  },

  // Create todo
  'POST /api/todos': async (req, res, params, b) => {
    const errors = validate(b, {
      title: { required: true, type: 'string', maxLength: 200 }
    });
    if (errors.length) return json(res, { error: 'Validation failed', details: errors }, 400);
    
    const data = await loadData();
    const todo = {
      id: genId(),
      title: b.title.trim(),
      completed: false,
      createdAt: new Date().toISOString()
    };
    data.push(todo);
    await saveData(data);
    json(res, todo, 201);
  },

  // Update todo
  'PUT /api/todos/:id': async (req, res, params, b) => {
    const data = await loadData();
    const idx = data.findIndex(t => t.id === params.id);
    if (idx === -1) return json(res, { error: 'Not found' }, 404);
    
    if (b.title !== undefined) data[idx].title = String(b.title).trim();
    if (b.completed !== undefined) data[idx].completed = Boolean(b.completed);
    data[idx].updatedAt = new Date().toISOString();
    
    await saveData(data);
    json(res, data[idx]);
  },

  // Toggle todo completion
  'PATCH /api/todos/:id/toggle': async (req, res, params) => {
    const data = await loadData();
    const idx = data.findIndex(t => t.id === params.id);
    if (idx === -1) return json(res, { error: 'Not found' }, 404);
    
    data[idx].completed = !data[idx].completed;
    data[idx].updatedAt = new Date().toISOString();
    
    await saveData(data);
    json(res, data[idx]);
  },

  // Delete todo
  'DELETE /api/todos/:id': async (req, res, params) => {
    let data = await loadData();
    const len = data.length;
    data = data.filter(t => t.id !== params.id);
    if (data.length === len) return json(res, { error: 'Not found' }, 404);
    await saveData(data);
    json(res, { ok: true });
  },

  // Bulk operations: clear completed
  'DELETE /api/todos': async (req, res) => {
    const url = new URL(req.url, 'http://localhost');
    if (url.searchParams.get('completed') !== 'true') {
      return json(res, { error: 'Must specify ?completed=true to bulk delete' }, 400);
    }
    let data = await loadData();
    const before = data.length;
    data = data.filter(t => !t.completed);
    await saveData(data);
    json(res, { deleted: before - data.length });
  }
};

// === SERVER ===
const server = createServer(async (req, res) => {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
    return res.end();
  }

  const url = new URL(req.url, `http://localhost:${PORT}`);
  const path = url.pathname;
  const method = req.method;

  try {
    // Try exact match
    const exactKey = `${method} ${path}`;
    if (routes[exactKey]) {
      const b = await body(req);
      return await routes[exactKey](req, res, {}, b);
    }

    // Try parameterized routes
    for (const [pattern, handler] of Object.entries(routes)) {
      const [m, p] = pattern.split(' ');
      if (m !== method) continue;
      const params = match(p, path);
      if (params) {
        const b = await body(req);
        return await handler(req, res, params, b);
      }
    }

    json(res, { error: 'Not found' }, 404);
  } catch (e) {
    console.error(e);
    json(res, { error: e.message || 'Internal server error' }, 500);
  }
});

server.listen(PORT, () => {
  console.log(`LLasM Todo API running at http://localhost:${PORT}`);
  console.log(`Data file: ${DATA_FILE}`);
  console.log('');
  console.log('Endpoints:');
  console.log('  GET    /health');
  console.log('  GET    /api/todos?completed=true&q=search&limit=10&offset=0');
  console.log('  GET    /api/todos/:id');
  console.log('  POST   /api/todos         { "title": "..." }');
  console.log('  PUT    /api/todos/:id     { "title": "...", "completed": true }');
  console.log('  PATCH  /api/todos/:id/toggle');
  console.log('  DELETE /api/todos/:id');
  console.log('  DELETE /api/todos?completed=true  (bulk delete completed)');
});
