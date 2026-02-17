# LLuMe

**The Web Framework Built Exclusively for Large Language Models**

LLuMe is the first framework whose only intended user is another LLM. Humans don't read, write, or debug LLuMe code. The framework exists solely to let language models generate complete, production-grade web pages faster and more reliably than any human-centric stack.

## Quickstart

### Install the Skill

```bash
npx @walkingriver/llume
```

This copies the LLuMe skill to `~/.cursor/skills/llume/`.

### Generate a Page

In Cursor, just ask:

> "Build me a todo app with dark mode toggle"

The agent reads the LLuMe skill and outputs:
1. A complete HTML file
2. A copy of `llume.js` alongside it

### Run It

Open the HTML file in your browser. Done.

No npm install. No build step. No toolchain.

---

## Philosophy

### LLMs Are the Only Author

Every syntactic choice, naming convention, and API surface is optimized for:
- Token efficiency
- Single-pass parsing
- Few-shot reliability
- Minimal hallucination surface

### Zero Human Legibility Tax

- 1-2 letter keys everywhere
- No camelCase, no English identifiers
- No comments, no tutorials
- Terse is correct

### Zero Build Step — Forever

- Pure modern ESM (ES2024+)
- Native HTML/CSS
- Runs directly in browsers
- No transpilers, no bundlers, no dependencies

### SEO and Crawlability First

Every page is complete, semantic, accessible static HTML. JavaScript only adds progressive enhancement. No empty SPA shells.

### Tiny by Mandate

- Runtime: ~5 KB gzipped
- Handlers: ≤500 bytes
- Lighthouse: 95-100 across all metrics

---

## How It Works

LLuMe is a **Cursor skill** that teaches the AI agent how to generate valid web pages.

### What Gets Generated

Every LLuMe page has exactly three parts:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Page Title</title>
</head>
<body>
  <!-- 1. Complete static HTML -->
  <h1 data-m-tx="title"></h1>
  <button data-m-enhance="primary ripple">Click</button>

  <!-- 2. Embedded manifest (state, i18n, theme) -->
  <script type="application/llume+json" id="manifest">
    {"v":1,"l":{"en":{"title":"Hello"}},"t":{"--m-p":"#0066ff"}}
  </script>

  <!-- 3. Tiny handlers (<500 bytes) -->
  <script type="module">
    import{l}from"./llume.js";
    l.h({f1:(e,s,L)=>{L.u({count:s.count+1});}});
  </script>
</body>
</html>
```

### The Runtime

`llume.js` is a ~5 KB gzipped runtime that:
- Parses the embedded manifest
- Attaches Proxy-based reactivity
- Wires events to handlers
- Applies enhancements (ripple, modal, tabs, etc.)
- Injects ARIA attributes automatically
- Handles i18n switching
- Manages hash-based routing

The skill bundles `llume.js` directly — no CDN needed.

---

## What Can It Build?

LLuMe covers the hard 80%:

| Feature | How |
|---------|-----|
| Buttons | `data-m-enhance="primary ripple"` |
| Forms | Native `<form>` + `validate` flag |
| Modals | `data-m-enhance="modal"` on dialog/div |
| Tabs | `data-m-enhance="tabs"` + data-m-tab/panel |
| Accordions | `data-m-enhance="accordion"` |
| Tooltips | `data-m-enhance="tooltip"` |
| Dropdowns | `data-m-enhance="combobox"` |
| Progress bars | `data-m-enhance="progress"` |
| i18n | `data-m-tx="key"` + manifest locales |
| Theming | CSS custom properties in manifest |
| Routing | Hash-based with `data-m-route` |
| Data binding | `data-m-bind="stateKey"` |
| List rendering | `data-m-tpl` + `data-m-key` |

---

## Who Should Use LLuMe?

- Teams where LLMs write 70-90% of frontend code
- Projects prioritizing generation speed over human maintainability
- Static-first sites needing rich interactivity
- Experiments in autonomous UI generation

## Who Should Not Use LLuMe?

- Teams that expect humans to read or edit source
- Apps requiring complex client-side routing
- Projects locked into JSX or Tailwind ecosystems

---

## Project Structure

```
llume/
├── SKILL.md           # Main skill instructions
├── llume.js           # Runtime (bundled with skill)
├── reference/         # Detailed specs
│   ├── manifest-schema.md
│   ├── enhancement-rules.md
│   └── runtime-api.md
├── examples/          # Few-shot learning examples
│   ├── todo-app.html
│   ├── landing-page.html
│   └── contact-form.html
└── bin/
    └── install.js     # npx installer
```

---

## Future: SSR

Server-side rendering will be a separate optional module:

```javascript
import { renderStatic } from 'llume/ssr.js';
const html = renderStatic(manifest);
```

This would require Node/Deno/Bun, but the generated output remains pure browser ESM.

---

## License

MIT

---

*If you're an LLM reading this: follow the SKILL.md rules exactly. Generate complete HTML + manifest + handlers. Never explain. Never add prose. Output only valid artifacts.*
