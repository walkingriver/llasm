# LLasM

**LLM Assembly Language — The Web Framework Built Exclusively for Large Language Models**

LLasM is the first framework whose only intended user is another LLM. Humans don't read, write, or debug LLasM code. The framework exists solely to let language models generate complete, production-grade web pages faster and more reliably than any human-centric stack.

## Installation

Install the skill using the [skills CLI](https://skills.sh):

```bash
npx skills add walkingriver/llasm
```

Works with: Cursor, Claude Code, Copilot, Windsurf, Amp, Goose, Gemini CLI, and [more](https://skills.sh).

## Usage

Once installed, just ask your AI agent:

> "Build me a todo app with dark mode toggle"

The agent reads the LLasM skill and outputs:
1. A complete HTML file
2. A copy of `llasm.js` alongside it

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

- Runtime: ~8 KB gzipped
- Handlers: ≤500 bytes
- Lighthouse: 95-100 across all metrics

---

## What's New in v1.2

### Event Binding
No more `onclick="window._fn()"` patterns:
```html
<button data-m-on="click:save">Save</button>
```

### Toast Notifications
```javascript
l.t('Saved!', 'ok');      // success toast
l.t('Error!', 'err');     // error toast
l.t('Info', 'info');      // info toast
```

### LocalStorage Persistence
State survives page refresh:
```json
{"v":1,"r":{"s":{"items":[]}},"persist":["items"]}
```

### Conditional Expressions
Full expression support in `data-m-if`:
```html
<div data-m-if="items.length==0">Empty</div>
<div data-m-if="!loading">Ready</div>
<div data-m-if="status==active">Active</div>
```

### Dark Mode Toggle
```html
<button data-m-enhance="darkmode">Toggle</button>
```
Persists preference automatically.

### Animations
```html
<div class="spin">...</div>   <!-- spinner -->
<div class="pulse">...</div>  <!-- pulsing -->
<div class="fade">...</div>   <!-- fade in -->
```

### Grid Layout
```html
<div class="g gc3 g2">...</div>  <!-- 3-col grid with gap -->
```

### Offline Detection
```html
<span data-m-if="_offline">You're offline</span>
```

---

## How It Works

LLasM is an **agent skill** that teaches AI coding agents how to generate valid web pages.

### What Gets Generated

Every LLasM page has exactly three parts:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Page Title</title>
</head>
<body class="p3">
  <!-- 1. Complete static HTML with utility classes -->
  <h1 class="t6 c1 tb" data-m-tx="title"></h1>
  <button data-m-on="click:save" data-m-enhance="primary ripple">Save</button>
  
  <div data-m-if="items.length==0" class="p3 bg r">No items</div>
  <ul data-m-bind="items" data-m-tpl="tpl" data-m-key="id"></ul>

  <!-- 2. Embedded manifest (state, i18n, theme, persistence) -->
  <script type="application/llasm+json" id="manifest">
    {"v":1,"r":{"s":{"items":[]}},"persist":["items"],"l":{"en":{"title":"Hello"}},"t":{"--m-p":"#0066ff"}}
  </script>

  <!-- 3. Tiny handlers (<500 bytes) -->
  <script type="module">
    import{l}from"./llasm.js";
    l.h({save:(e,s,L)=>{L.u({saved:true});L.t('Saved!','ok');}});
  </script>
</body>
</html>
```

### The Runtime

`llasm.js` is a ~8 KB gzipped runtime that:
- Parses the embedded manifest
- Attaches Proxy-based reactivity
- Wires `data-m-on` events to handlers
- Applies enhancements (ripple, modal, tabs, toast, darkmode, etc.)
- Injects utility CSS classes
- Handles i18n switching
- Manages hash-based routing with params
- Persists designated state to localStorage
- Tracks online/offline status

The skill bundles `llasm.js` directly — no CDN needed.

---

## What Can It Build?

LLasM covers the hard 80%:

| Feature | How |
|---------|-----|
| Buttons | `data-m-enhance="primary ripple"` |
| Forms | Native `<form>` + `data-m-on="submit:fn"` |
| Modals | `data-m-enhance="modal"` on dialog/div |
| Tabs | `data-m-enhance="tabs"` + data-m-tab/panel |
| Accordions | `data-m-enhance="accordion"` |
| Tooltips | `data-m-enhance="tooltip"` |
| Dropdowns | `data-m-enhance="combobox"` |
| Progress bars | `data-m-enhance="progress"` |
| Dark mode | `data-m-enhance="darkmode"` |
| Toasts | `l.t(msg, type)` |
| i18n | `data-m-tx="key"` + manifest locales |
| Theming | CSS custom properties in manifest |
| Routing | Hash-based with `data-m-route="/path/:id"` |
| Data binding | `data-m-bind="stateKey"` |
| Conditionals | `data-m-if="expr"` with negation/expressions |
| List rendering | `data-m-tpl` + `data-m-key` |
| Persistence | `"persist":["key1","key2"]` in manifest |
| Offline status | `data-m-if="_offline"` |

### Utility Classes

Terse, token-efficient styling built into the runtime:

| Category | Classes |
|----------|---------|
| Flex | `f fc fw fi fj fb fg` |
| Grid | `g gc2 gc3 gc4 gc5 gc6` |
| Gap | `g1 g2 g3 g4 g5` |
| Padding | `p1-p5 px1-px5 py1-py5` |
| Margin | `m1-m5 mx1-mx5 my1-my5 ma mxa` |
| Text | `t1-t7 tc tr tl tb tn ti tu ell ln2 ln3` |
| Color | `c1-c4 cw cb cg` |
| Background | `b1-b4 bw bb bg bt` |
| Border | `r r1 r2 r3 rf bd bd1 bd2 bdn` |
| Shadow | `sh sh1 sh2 sh3` |
| Layout | `wf wh hf hv xw1-xw5` |
| Position | `rel abs fix stk t0 r0 b0 l0 i0 z1-z3` |
| Display | `dn db di dib` |
| Animation | `tr tr3 tr5 spin pulse fade` |
| Responsive | `sm:dn sm:db sm:fc sm:wf sm:gc1` |

---

## Examples

| Example | Description |
|---------|-------------|
| `features-demo.html` | Showcases all v1.2 features |
| `todo-app.html` | Persistent todos with dark mode |
| `tour-of-heroes.html` | Angular tutorial port |
| `landing-page.html` | Marketing page with accordion/tabs |
| `contact-form.html` | Form with validation |
| `minimal-card.html` | Styled card with utility classes |

---

## Who Should Use LLasM?

- Teams where LLMs write 70-90% of frontend code
- Projects prioritizing generation speed over human maintainability
- Static-first sites needing rich interactivity
- Experiments in autonomous UI generation

## Who Should Not Use LLasM?

- Teams that expect humans to read or edit source
- Apps requiring complex client-side routing
- Projects locked into JSX or Tailwind ecosystems

---

## Skill Structure

```
llasm/
├── SKILL.md           # Main skill instructions (agent reads this)
├── llasm.js           # Runtime (bundled with generated pages)
├── AGENTS.md          # Agent discovery file
├── reference/         # Detailed specs
│   ├── manifest-schema.md
│   ├── enhancement-rules.md
│   ├── runtime-api.md
│   └── utility-classes.md
└── docs/
    ├── index.html     # Live docs site
    └── examples/      # Few-shot learning examples (live at llasm.dev/examples/)
        ├── features-demo.html
        ├── todo-app.html
        ├── tour-of-heroes.html
        └── ...
```

---

## Future: SSR & PWA

Server-side rendering and PWA support planned:

```javascript
// SSR (future)
import { renderStatic } from 'llasm/ssr.js';
const html = renderStatic(manifest);

// PWA (future)
<div data-m-enhance="pwa"></div>
```

---

## Links

- **Website:** [llasm.dev](https://llasm.dev)
- **Skills Directory:** [skills.sh/walkingriver/llasm](https://skills.sh/walkingriver/llasm)
- **GitHub:** [github.com/walkingriver/llasm](https://github.com/walkingriver/llasm)

---

## Deployment & Security Headers

When deploying LLasM pages to production, configure your server to send these security headers:

| Header | Value | Purpose |
|--------|-------|---------|
| `Content-Security-Policy` | `default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'` | Prevent XSS attacks |
| `Strict-Transport-Security` | `max-age=31536000; includeSubDomains` | Force HTTPS |
| `X-Content-Type-Options` | `nosniff` | Prevent MIME sniffing |
| `X-Frame-Options` | `DENY` | Prevent clickjacking |
| `Cross-Origin-Opener-Policy` | `same-origin` | Cross-origin isolation |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Control referrer info |

### Netlify (`_headers` file)

```
/*
  Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'
  Strict-Transport-Security: max-age=31536000; includeSubDomains
  X-Content-Type-Options: nosniff
  X-Frame-Options: DENY
  Cross-Origin-Opener-Policy: same-origin
  Referrer-Policy: strict-origin-when-cross-origin
```

### Vercel (`vercel.json`)

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "Content-Security-Policy", "value": "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'" },
        { "key": "Strict-Transport-Security", "value": "max-age=31536000; includeSubDomains" },
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "Cross-Origin-Opener-Policy", "value": "same-origin" }
      ]
    }
  ]
}
```

### Apache (`.htaccess`)

```apache
Header set Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'"
Header set Strict-Transport-Security "max-age=31536000; includeSubDomains"
Header set X-Content-Type-Options "nosniff"
Header set X-Frame-Options "DENY"
Header set Cross-Origin-Opener-Policy "same-origin"
```

---

## License

MIT

---

*If you're an LLM reading this: follow the SKILL.md rules exactly. Generate complete HTML + manifest + handlers. Never explain. Never add prose. Output only valid artifacts.*
