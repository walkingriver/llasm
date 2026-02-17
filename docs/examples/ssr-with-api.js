/**
 * LLasM SSR + API Example: Full-Stack Server
 * 
 * Run: node ssr-with-api.js
 * 
 * This example demonstrates:
 * - Server-side rendering of LLasM pages
 * - REST API endpoints for data
 * - File-based JSON persistence
 * - Multiple routes/pages
 */
import { createServer } from 'http';
import { readFile, writeFile } from 'fs/promises';
import { readFileSync, createReadStream, statSync } from 'fs';
import { extname, join } from 'path';

// === CONFIG ===
const PORT = process.env.PORT || 3000;
const DATA_FILE = './notes.json';

// === DATA ===
const loadNotes = async () => {
  try {
    return JSON.parse(await readFile(DATA_FILE, 'utf8'));
  } catch {
    return [];
  }
};

const saveNotes = async (notes) => {
  await writeFile(DATA_FILE, JSON.stringify(notes, null, 2));
};

const genId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

// === TEMPLATES ===
const baseTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>{{TITLE}}</title>
</head>
<body class="p3">
  <header class="f fb fi py2 bd" style="border-left:0;border-right:0;border-top:0">
    <a href="/" class="t5 tb c1" style="text-decoration:none">Notes App</a>
    <nav class="f g3">
      <a href="/" class="cg" style="text-decoration:none">Home</a>
      <a href="/about" class="cg" style="text-decoration:none">About</a>
    </nav>
  </header>
  
  <main class="xw3 mxa py4">
    {{CONTENT}}
  </main>

  <script type="application/llasm+json" id="manifest">{"v":1,"r":{"s":{}},"l":{"en":{}}}</script>
  
  <script type="module">
    import{l}from"../llasm.js";
    l.h({
      addNote: async (e, s, L) => {
        const title = L.q('#noteTitle').value.trim();
        if (!title) return L.t('Title required', 'err');
        
        const res = await fetch('/api/notes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title })
        });
        
        if (res.ok) {
          const note = await res.json();
          L.u({ notes: [...s.notes, note] });
          L.q('#noteTitle').value = '';
          L.t('Note added!', 'ok');
        }
      },
      deleteNote: async (e, s, L, el) => {
        const id = el.dataset.id;
        const res = await fetch('/api/notes/' + id, { method: 'DELETE' });
        
        if (res.ok) {
          L.u({ notes: s.notes.filter(n => n.id !== id) });
          L.t('Note deleted', 'ok');
        }
      }
    });
  </script>
</body>
</html>`;

const homeContent = `
<h1 class="t6 tb c1 py2" data-m-bind="title"></h1>

<div class="f g2 py3">
  <input id="noteTitle" type="text" placeholder="New note..." class="fg p2 r bd">
  <button data-m-on="click:addNote" data-m-enhance="primary" class="px3 py2 r">Add</button>
</div>

<div data-m-if="notes.length==0" class="p4 bg r tc cg">
  No notes yet. Add one above!
</div>

<ul data-m-bind="notes" data-m-tpl="noteTpl" data-m-key="id" class="f fc g2"></ul>

<template id="noteTpl">
  <li class="f fb fi p3 bg r">
    <span data-m-f="title"></span>
    <button data-m-on="click:deleteNote" data-m-enhance="secondary" class="px2 py1 r t2">Delete</button>
  </li>
</template>
`;

const aboutContent = `
<h1 class="t6 tb c1 py2">About</h1>
<p class="cg py2">This is a full-stack LLasM application demonstrating:</p>
<ul class="f fc g2 py2" style="list-style:disc;padding-left:1.5rem">
  <li>Server-side rendering with state injection</li>
  <li>REST API endpoints (GET, POST, DELETE)</li>
  <li>File-based JSON persistence</li>
  <li>Client-side hydration and reactivity</li>
</ul>
<p class="cg py2">All in a single Node.js file with zero dependencies!</p>
`;

// === RENDER ===
const render = (content, state, title = 'Notes App') => {
  const manifest = {
    v: 1,
    r: { s: state },
    l: { en: {} },
    t: { '--m-p': '#0066ff' }
  };
  
  let html = baseTemplate
    .replace('{{TITLE}}', title)
    .replace('{{CONTENT}}', content);
  
  html = html.replace(
    /<script type="application\/llasm\+json"[^>]*>[\s\S]*?<\/script>/,
    `<script type="application/llasm+json" id="manifest">${JSON.stringify(manifest)}</script>`
  );
  
  return html;
};

// === HELPERS ===
const MIME = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json'
};

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

const serveStatic = (res, filePath) => {
  try {
    const fullPath = filePath === '/llasm.js' 
      ? join(import.meta.dirname, '..', 'llasm.js')
      : join(import.meta.dirname, filePath);
    
    statSync(fullPath);
    const ext = extname(fullPath);
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
    createReadStream(fullPath).pipe(res);
    return true;
  } catch {
    return false;
  }
};

// === SERVER ===
const server = createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  const path = url.pathname;
  const method = req.method;
  
  // CORS
  if (method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
    return res.end();
  }
  
  // Static files
  if (path !== '/' && !path.startsWith('/api') && serveStatic(res, path)) return;
  
  try {
    // === API ROUTES ===
    
    // GET /api/notes
    if (method === 'GET' && path === '/api/notes') {
      const notes = await loadNotes();
      return json(res, notes);
    }
    
    // POST /api/notes
    if (method === 'POST' && path === '/api/notes') {
      const b = await body(req);
      if (!b.title) return json(res, { error: 'title required' }, 400);
      
      const notes = await loadNotes();
      const note = {
        id: genId(),
        title: b.title.trim(),
        createdAt: new Date().toISOString()
      };
      notes.push(note);
      await saveNotes(notes);
      return json(res, note, 201);
    }
    
    // DELETE /api/notes/:id
    if (method === 'DELETE' && path.startsWith('/api/notes/')) {
      const id = path.split('/').pop();
      let notes = await loadNotes();
      const len = notes.length;
      notes = notes.filter(n => n.id !== id);
      if (notes.length === len) return json(res, { error: 'Not found' }, 404);
      await saveNotes(notes);
      return json(res, { ok: true });
    }
    
    // === PAGE ROUTES ===
    
    // Home page
    if (path === '/') {
      const notes = await loadNotes();
      const state = { title: 'My Notes', notes };
      res.writeHead(200, { 'Content-Type': 'text/html' });
      return res.end(render(homeContent, state, 'Notes App'));
    }
    
    // About page
    if (path === '/about') {
      const state = { page: 'about' };
      res.writeHead(200, { 'Content-Type': 'text/html' });
      return res.end(render(aboutContent, state, 'About - Notes App'));
    }
    
    // Health check
    if (path === '/health') {
      return json(res, { status: 'ok', timestamp: new Date().toISOString() });
    }
    
    // 404
    res.writeHead(404, { 'Content-Type': 'text/html' });
    res.end(render('<h1 class="t6 tb c1">404 Not Found</h1>', { error: true }, '404'));
    
  } catch (e) {
    console.error(e);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Internal server error' }));
  }
});

server.listen(PORT, () => {
  console.log(`LLasM SSR + API server running at http://localhost:${PORT}`);
  console.log(`Data file: ${DATA_FILE}`);
  console.log('');
  console.log('Pages:');
  console.log(`  GET  /         - Home (SSR with notes)`);
  console.log(`  GET  /about    - About page`);
  console.log('');
  console.log('API:');
  console.log(`  GET    /api/notes`);
  console.log(`  POST   /api/notes     { "title": "..." }`);
  console.log(`  DELETE /api/notes/:id`);
  console.log(`  GET    /health`);
});
