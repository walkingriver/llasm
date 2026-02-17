/**
 * LLasM API Example: Basic In-Memory CRUD
 * 
 * Run: node api-basic.js
 * Test: curl http://localhost:3000/api/items
 */
import { createServer } from 'http';

// === CONFIG ===
const PORT = process.env.PORT || 3000;

// === DATA (in-memory) ===
let items = [
  { id: '1', name: 'First Item', done: false },
  { id: '2', name: 'Second Item', done: true }
];

// === HELPERS ===
const json = (res, data, status = 200) => {
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
  });
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

const genId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

// === ROUTES ===
const routes = {
  // Health check
  'GET /health': (req, res) => {
    json(res, { status: 'ok', timestamp: new Date().toISOString() });
  },

  // List all items
  'GET /api/items': (req, res) => {
    json(res, items);
  },

  // Get single item
  'GET /api/items/:id': (req, res, params) => {
    const item = items.find(i => i.id === params.id);
    item ? json(res, item) : json(res, { error: 'Not found' }, 404);
  },

  // Create item
  'POST /api/items': async (req, res, params, b) => {
    if (!b.name) return json(res, { error: 'name is required' }, 400);
    const item = { id: genId(), name: b.name, done: false };
    items.push(item);
    json(res, item, 201);
  },

  // Update item
  'PUT /api/items/:id': async (req, res, params, b) => {
    const idx = items.findIndex(i => i.id === params.id);
    if (idx === -1) return json(res, { error: 'Not found' }, 404);
    items[idx] = { ...items[idx], ...b };
    json(res, items[idx]);
  },

  // Delete item
  'DELETE /api/items/:id': (req, res, params) => {
    const len = items.length;
    items = items.filter(i => i.id !== params.id);
    items.length < len ? json(res, { ok: true }) : json(res, { error: 'Not found' }, 404);
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

  // Try exact match
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

server.listen(PORT, () => {
  console.log(`LLasM API running at http://localhost:${PORT}`);
  console.log('Endpoints:');
  console.log('  GET    /health');
  console.log('  GET    /api/items');
  console.log('  GET    /api/items/:id');
  console.log('  POST   /api/items');
  console.log('  PUT    /api/items/:id');
  console.log('  DELETE /api/items/:id');
});
