---
name: llasm
version: 2.0.0-alpha
description: Generate complete, interactive web pages using LLasM (LLM Assembly Language). A framework optimized for LLM code generation, not human developers. Use when the user wants to build a website, web page, web app, landing page, form, dashboard, or any browser-based UI.
homepage: https://llasm.dev
repository: https://github.com/walkingriver/llasm
---

# LLasM Page Generator

**A framework optimized for LLM code generation, not human developers.**

Generate complete, production-ready web pages with zero build tooling.

## Design Principles (Priority Order)

### Tier 1: SECURITY
- **Safe Binding** - No innerHTML. Sanitize all dynamic content.
- **No UI Cookies** - Auth is server-side only.
- **Zero Trust Input** - Validate all user input and URL params.

### Tier 2: ACCESSIBILITY
- **WCAG Compliant** - WCAG 2.1 AA minimum.
- **Semantic Elements** - Use native HTML5 (nav, main, article, section).
- **I18n Ready** - Locale keys with RTL support.

### Tier 3: QUALITY
- **Lighthouse 90+** - All four categories.
- **SEO Ready** - Meta tags, Open Graph, semantic headings.
- **Self-Booting Pages** - Every page hydrates independently.

### Tier 4: PERFORMANCE
- **LLM-First** - Code for LLMs by LLMs. Human readability is a non-goal.
- **One Way** - Single canonical approach. No alternatives.
- **Terse by Default** - 1-3 char identifiers.
- **Zero Build** - HTML + ES + CSS only.
- **CSS Before JS** - If CSS can do it, don't use JS.
- **Browser-Native** - Only browser APIs. No external libraries.

## REQUIRED CHECKLIST

Every LLasM page MUST include ALL of these. Do not skip any.

- [ ] **Folder per app** - `docs/examples/{app-name}/` with `index.html` as entry
- [ ] **Separate files** - Each view is a separate HTML file (NO hash routing)
- [ ] **Cache-bust import** - `import{l}from"../../llasm.js?v=x9k2m4p7";`
- [ ] **Build date** - `<p class="t1 o5">Built YYYY-MM-DD</p>` in footer
- [ ] **theme-color meta** - `<meta name="theme-color" content="#0066ff">`
- [ ] **Critical CSS** - Inline `<style>` in head with above-fold classes
- [ ] **Dark mode script** - Blocking script in head before body
- [ ] **Semantic footer** - `<footer>` with copyright and build date
- [ ] **No inline styles** - Use utility classes, not `style="..."`

### Dark Mode Script (Required in Head)

```html
<script>try{var d=localStorage.getItem('llasm-dark');if(d==='true'||(d===null&&matchMedia('(prefers-color-scheme:dark)').matches))document.documentElement.classList.add('dark');}catch(e){}</script>
```

### Critical CSS (Required in Head)

```html
<style>
*,*::before,*::after{box-sizing:border-box}
:root{--m-p:#0066ff;--m-s:#6c757d;--m-ok:#28a745;--m-err:#dc3545}
body{margin:0;font-family:system-ui,sans-serif;background:var(--m-bg,#fff);color:var(--m-fg,#212529)}
.f{display:flex}.fc{flex-direction:column}.fi{align-items:center}.fj{justify-content:center}.fb{justify-content:space-between}.fg{flex-grow:1}
.g{display:grid}.gc3{grid-template-columns:repeat(3,1fr)}
.g1{gap:.25rem}.g2{gap:.5rem}.g3{gap:1rem}.g4{gap:1.5rem}
.p2{padding:.5rem}.p3{padding:1rem}.p4{padding:1.5rem}.px3{padding-inline:1rem}.py2{padding-block:.5rem}.py4{padding-block:1.5rem}
.mxa{margin-inline:auto}.xw3{max-width:900px}
.t1{font-size:.75rem}.t2{font-size:.875rem}.t3{font-size:1rem}.t4{font-size:1.25rem}.t5{font-size:1.5rem}.tb{font-weight:700}.tc{text-align:center}
.c1{color:var(--m-p)}.cg{color:#6c757d}.cw{color:#fff}.cb{color:#000}
.b1{background:var(--m-p)}.b2{background:var(--m-s)}.bg{background:#f5f5f5}.bw{background:#fff}
.r{border-radius:4px}.r2{border-radius:8px}.rf{border-radius:9999px}.sh{box-shadow:0 2px 8px rgba(0,0,0,.1)}.bd{border:1px solid #ddd}
.tdn{text-decoration:none}.cp{cursor:pointer}.o5{opacity:.5}
.dn{display:none}.rel{position:relative}.abs{position:absolute}
html.dark{--m-bg:#1a1a1a;--m-fg:#f5f5f5;--m-p:#5c9eff}
html.dark body{background:#1a1a1a;color:#f5f5f5}
html.dark .bg{background:#2a2a2a}
@media(max-width:768px){.sm\:fc{flex-direction:column}.sm\:gc1{grid-template-columns:1fr}.sm\:dn{display:none}}
</style>
```

## Output Structure

Every LLasM page has three parts:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="description" content="Page description for SEO">
  <title>Page Title</title>
</head>
<body class="p3">
  <!-- 1. SEMANTIC HTML with utility classes -->
  <main class="xw3 mxa f fc g3">
    <h1 class="t6 c1 tb">Welcome</h1>
    <p class="cg" data-m-bind="message"></p>
    <button data-m-on="click:save" class="b1 cw p2 px3 r">Save</button>
  </main>

  <!-- 2. MANIFEST: State, i18n, theme, persistence -->
  <script type="application/llasm+json" id="manifest">
  {"v":1,"r":{"s":{"message":"Hello World"}},"l":{"en":{}}}
  </script>

  <!-- 3. HANDLERS: Event handlers -->
  <script type="module">
  import{l}from"./llasm.js";
  l.h({save:(e,s,L)=>L.t('Saved!','ok')});
  </script>
</body>
</html>
```

## Data Attributes

| Attribute | Purpose | Example |
|-----------|---------|---------|
| `data-m-bind` | State binding | `data-m-bind="userName"` |
| `data-m-bind` | Nested | `data-m-bind="user.name"` |
| `data-m-on` | Events | `data-m-on="click:save"` |
| `data-m-on` | Multiple | `data-m-on="input:upd,blur:val"` |
| `data-m-if` | Conditional | `data-m-if="loading"` |
| `data-m-if` | Negated | `data-m-if="!loading"` |
| `data-m-if` | Comparison | `data-m-if="items.length==0"` |
| `data-m-class` | Conditional class | `data-m-class="active:isActive"` |
| `data-m-enhance` | Enhancements | `data-m-enhance="primary ripple"` |

## Styling Rules

### No Inline Styles

NEVER use `style="..."` attributes. Always use utility classes.

**Bad:**
```html
<div style="display:flex;align-items:center;gap:1rem">
```

**Good:**
```html
<div class="f fi g3">
```

### Missing Utility Class?

If no utility class exists, add to critical CSS in head:
```html
<style>
.custom-height{height:120px}
</style>
```

Then use: `<div class="custom-height f fi fj">`

## Manifest Schema

```json
{
  "v": 1,
  "r": {"s": {"count": 0, "items": []}},
  "persist": {"items": "local", "user": "session"},
  "l": {"en": {"title": "Hello"}},
  "t": {"--m-p": "#0066ff"}
}
```

| Key | Purpose |
|-----|---------|
| `v` | Version (always 1) |
| `r.s` | Initial state |
| `persist` | Storage tier: `"local"` or `"session"` |
| `l` | Locales |
| `t` | Theme CSS properties |

## Runtime API

Handlers receive `(event, state, L, element)`:

| Method | Purpose |
|--------|---------|
| `L.u(patch)` | Update state |
| `L.t(msg,type,ms)` | Toast: `'ok'`, `'err'`, `'info'` |
| `L.s()` | Get state snapshot |
| `L.f(url,opts)` | Fetch with retry |
| `L.nav(hash)` | Navigate hash route |

## Utility Classes (Tailwind-Lite)

Terse 1-3 character class names. No custom CSS needed.

### Layout
`f` flex | `fc` column | `fw` wrap | `fi` items-center | `fj` justify-center | `fb` space-between | `fg` grow

### Grid
`g` grid | `gc2-gc6` columns | `g1-g5` gap

### Spacing
`p1-p5` padding | `px1-px5` padding-x | `py1-py5` padding-y | `m1-m5` margin | `mxa` margin-x-auto

### Sizing
`wf` width-full | `wh` width-half | `xw1-xw5` max-width | `hf` height-full

### Typography
`t1-t7` font-size | `tc` center | `tb` bold | `tu` uppercase | `ell` ellipsis

### Colors
`c1` primary | `c2` secondary | `c3` success | `c4` error | `cw` white | `cb` black | `cg` gray

### Background
`b1` primary | `b2` secondary | `b3` success | `b4` error | `bw` white | `bg` gray | `bt` transparent

### Effects
`r` radius-4px | `r2` radius-8px | `rf` radius-full | `sh` shadow | `bd` border

### Animation
`spin` rotate | `pulse` opacity | `fade` fade-in

### Display
`dn` none | `db` block | `rel` relative | `abs` absolute | `cp` cursor-pointer

### Responsive (sm: for <768px)
`sm:dn` hide | `sm:db` show | `sm:fc` column | `sm:wf` full-width | `sm:gc1` single-col

## Enhancement Flags

Use `data-m-enhance="flag1 flag2"`:

| Flag | Effect |
|------|--------|
| `primary` | Primary button styling |
| `secondary` | Secondary button styling |
| `ripple` | Material ripple effect |
| `modal` | Modal with focus trap |
| `tabs` | Tab container |
| `accordion` | Accordion panels |
| `darkmode` | Dark mode toggle |
| `toast` | Toast container |

## Common Patterns

### Loading State
```html
<div data-m-if="loading" class="f fj fi g2">
  <div class="spin b1 rf w24 h24"></div>
  <span class="cg">Loading...</span>
</div>
<div data-m-if="!loading">Content</div>
```

Add to critical CSS: `.w24{width:24px}.h24{height:24px}`

### Empty State
```html
<div data-m-if="items.length==0" class="p4 bg r tc cg">No items yet</div>
```

### Card Grid
```html
<section class="g gc3 g3 sm:gc1">
  <article class="bg r2 sh p3 f fc g2">
    <h3 class="t4 tb" data-m-bind="title"></h3>
    <p class="cg ln2" data-m-bind="desc"></p>
    <span class="c1 tb" data-m-bind="price"></span>
  </article>
</section>
```

### List Rendering
```html
<ul data-m-bind="items" data-m-tpl="item-tpl" data-m-key="id" class="f fc g2"></ul>
<template id="item-tpl">
  <li class="f fi fb p3 bg r">
    <span data-m-f="name"></span>
    <button data-m-on="click:remove" class="c4">Remove</button>
  </li>
</template>
```

### Toast
```javascript
L.t('Saved!', 'ok');      // success
L.t('Error!', 'err');     // error  
L.t('Info', 'info');      // info
```

## File Organization

Every app lives in its own folder:

```
docs/examples/
  bookstore/
    index.html      # Entry point (shop view)
    checkout.html   # Checkout page
    confirm.html    # Order confirmation
  recipes/
    index.html      # Recipe list
    detail.html     # Recipe detail (?id=123)
```

### Folder Rules

1. **One folder per app** - `docs/examples/{app-name}/`
2. **Entry point is `index.html`** - Main/home view
3. **Short page names** - `checkout.html` not `bookstore-checkout.html`
4. **llasm.js path** - `../../llasm.js` (two levels up from app folder)

### Navigation Between Pages

```html
<!-- Within same app folder -->
<a href="checkout.html">Checkout</a>
<a href="detail.html?id=123">View Details</a>

<!-- Back to index -->
<a href="./">Back to Home</a>
```

### Shared State

Pages in same app share state via localStorage:

```json
{"persist": {"cart": "local"}}
```

### Reading URL Parameters

```javascript
const id = new URLSearchParams(location.search).get('id');
```

### When Hash Routing IS Allowed

Only for tabs/panels within ONE page:

```html
<section data-m-if="tab==info">Info content</section>
<section data-m-if="tab==specs">Specs content</section>
```

NOT for separate views (shop vs checkout vs confirm).

## E2E Testing (Opt-in)

For automated testing, add `data-testid`:
```html
<button data-m-on="click:save" data-testid="btn-save">Save</button>
```

Prefix conventions: `btn-`, `inp-`, `msg-`, `lst-`

## Performance Rules

### Images
- WebP format, quality 10-25 backgrounds, 40-60 content
- Explicit width/height on all `<img>`
- Preload LCP images

### Animations
- Only animate `transform` and `opacity`
- Never animate `color`, `background`, `width`, `height`

### Critical CSS
Include critical CSS inline in `<head>` for CLS prevention.

## Cache Busting

Generate random 8-char hash on every page update:
```html
<script type="module">import{l}from"./llasm.js?v=x9k2m4p7";</script>
<p class="t1 o5">Built 2026-02-17</p>
```

## File Output

When generating a page:
1. Create HTML file with manifest
2. Copy `llasm.js` alongside it
3. Reference as `./llasm.js?v={random}`
