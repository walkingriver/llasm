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

## Valid Attributes

Only these `data-m-*` attributes exist. **Do NOT invent new ones.**

| Attribute | Purpose | Example |
|-----------|---------|---------|
| `data-m-bind` | State binding | `data-m-bind="user.name"` |
| `data-m-on` | Events | `data-m-on="click:save"` |
| `data-m-if` | Conditional | `data-m-if="!loading"` |
| `data-m-class` | Conditional class | `data-m-class="active:isActive"` |
| `data-m-enhance` | Enhancements | `data-m-enhance="primary ripple"` |
| `data-m-tpl` | Template ID | `data-m-tpl="item-tpl"` |
| `data-m-key` | List key field | `data-m-key="id"` |
| `data-m-f` | Template field | `data-m-f="name"` |
| `data-m-tx` | i18n text key | `data-m-tx="title"` |
| `data-m-route` | Hash route | `data-m-route="/settings"` |

**Invalid (do not use):** `data-m-href`, `data-m-src`, `data-m-attr`, `data-m-for`, etc.

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

## Static HTML First

**When data is known at generation time, render static HTML. Do NOT use templates.**

### Good: Static HTML with Real Links

```html
<section class="g gc3 g3 sm:gc1">
  <a href="detail.html?id=1" class="bg r2 sh p3 f fc g2 tdn cb">
    <h2 class="t4 tb">Spaghetti Carbonara</h2>
    <span class="t2 cg">25 min</span>
  </a>
  <a href="detail.html?id=2" class="bg r2 sh p3 f fc g2 tdn cb">
    <h2 class="t4 tb">Chicken Stir Fry</h2>
    <span class="t2 cg">20 min</span>
  </a>
</section>
```

### Bad: Template for Known Data

```html
<!-- DON'T do this when data is known -->
<section data-m-bind="recipes" data-m-tpl="tpl" data-m-key="id"></section>
```

### When to Use Templates

Only use `data-m-bind` with templates for:
- Data fetched from API at runtime
- User-generated content (cart items, form entries)
- Data that changes after page load

### Navigation Rules

- **Always use `<a href>`** for page navigation
- **Never use click handlers** for navigation
- **Never invent new `data-m-*` attributes** - only use documented ones

## Prescribed Patterns

Use these exact patterns. Do not deviate.

### 1. State Definition

State MUST be defined in manifest `r.s`. Persistence MUST be in `persist`.

```json
{
  "v": 1,
  "r": {"s": {
    "cart": [],
    "user": null,
    "loading": false
  }},
  "persist": {
    "cart": "local",
    "user": "session"
  }
}
```

- `"local"` - survives browser restart (localStorage)
- `"session"` - survives page refresh, cleared on tab close (sessionStorage)

### 2. Shopping Cart

**Manifest:**
```json
{"r":{"s":{"cart":[]}},"persist":{"cart":"local"}}
```

**Add button (static HTML, known product):**
```html
<button data-m-on="click:addItem" data-id="123" data-name="Widget" data-price="9.99" class="b1 cw p2 px3 r">Add to Cart</button>
```

**Handler:**
```javascript
addItem:(e,s,L,el)=>{
  const item={id:el.dataset.id,name:el.dataset.name,price:parseFloat(el.dataset.price),qty:1};
  const existing=s.cart.find(c=>c.id===item.id);
  if(existing){l.u({cart:s.cart.map(c=>c.id===item.id?{...c,qty:c.qty+1}:c)});}
  else{l.u({cart:[...s.cart,item]});}
  L.t('Added to cart','ok');
}
```

**Cart count display:**
```html
<span data-m-bind="cart.length"></span>
```

**Cart on another page:** Same manifest with `persist` loads cart automatically.

### 3. Form Input

**Manifest:**
```json
{"r":{"s":{"form":{"name":"","email":""}}}}
```

**Input fields:**
```html
<input type="text" data-m-bind="form.name" data-m-on="input:updateForm" name="name" class="wf p2 bd r">
<input type="email" data-m-bind="form.email" data-m-on="input:updateForm" name="email" class="wf p2 bd r">
```

**Handler:**
```javascript
updateForm:(e,s,L)=>{
  l.u({form:{...s.form,[e.target.name]:e.target.value}});
}
```

**Submit:**
```html
<button data-m-on="click:submitForm" class="b1 cw p2 px3 r">Submit</button>
```

```javascript
submitForm:(e,s,L)=>{
  if(!s.form.name||!s.form.email){L.t('Fill all fields','err');return;}
  L.t('Submitted!','ok');
  l.u({form:{name:'',email:''}});
}
```

### 4. Button Action

**Pattern:** Click → Update state → Show feedback

```html
<button data-m-on="click:doAction" class="b1 cw p2 px3 r">Action</button>
```

```javascript
doAction:(e,s,L)=>{
  l.u({actionDone:true});
  L.t('Done!','ok');
}
```

### 5. Loading State

**Manifest:**
```json
{"r":{"s":{"loading":false,"data":null,"error":null}}}
```

**Markup:**
```html
<div data-m-if="loading" class="f fj fi g2 p4">
  <div class="spin b1 rf w24 h24"></div>
  <span class="cg">Loading...</span>
</div>
<div data-m-if="error" class="p4 b4 cw r">Error loading data</div>
<div data-m-if="!loading" data-m-if="!error">Content here</div>
```

**Handler:**
```javascript
loadData:async(e,s,L)=>{
  l.u({loading:true,error:null});
  try{
    const data=await L.f('/api/data');
    l.u({loading:false,data});
  }catch(err){
    l.u({loading:false,error:err.message});
  }
}
```

### 6. Detail Page (URL Params)

**In detail.html:**
```javascript
const id=new URLSearchParams(location.search).get('id');
if(!id){l.u({notFound:true});return;}
// Find item from static data or fetch from API
```

**Markup:**
```html
<div data-m-if="notFound" class="p4 bg r tc">
  <p class="cg">Not found</p>
  <a href="./" class="c1">Back to list</a>
</div>
<article data-m-if="!notFound">
  <h1 data-m-bind="item.name" class="t6 tb"></h1>
</article>
```

### 7. Conditional Display

```html
<!-- Show when true -->
<div data-m-if="isLoggedIn">Welcome back!</div>

<!-- Show when false -->
<div data-m-if="!isLoggedIn">Please log in</div>

<!-- Show when empty -->
<div data-m-if="items.length==0">No items</div>

<!-- Show when has items -->
<div data-m-if="items.length>0">Has items</div>
```

### 8. Dark Mode (Complete)

**In head (blocking script):**
```html
<script>try{var d=localStorage.getItem('llasm-dark');if(d==='true'||(d===null&&matchMedia('(prefers-color-scheme:dark)').matches))document.documentElement.classList.add('dark');}catch(e){}</script>
```

**Toggle button:**
```html
<button data-m-enhance="darkmode" class="bg p2 px3 r cp">Dark</button>
```

**In critical CSS:**
```css
html.dark{--m-bg:#1a1a1a;--m-fg:#f5f5f5;--m-p:#5c9eff}
html.dark body{background:#1a1a1a;color:#f5f5f5}
html.dark .bg{background:#2a2a2a}
```

### 9. Toast Feedback

```javascript
L.t('Success message', 'ok');     // green
L.t('Error message', 'err');      // red
L.t('Info message', 'info');      // blue
L.t('Custom duration', 'ok', 5000); // 5 seconds
```

### 10. Static Card Grid (Known Data)

**Do NOT use templates. Render static HTML:**

```html
<section class="g gc3 g3 sm:gc1">
  <a href="detail.html?id=1" class="bg r2 sh p3 f fc g2 tdn cb">
    <h3 class="t4 tb">Product Name</h3>
    <p class="cg t2">Description here</p>
    <span class="c1 tb">$19.99</span>
  </a>
  <a href="detail.html?id=2" class="bg r2 sh p3 f fc g2 tdn cb">
    <h3 class="t4 tb">Another Product</h3>
    <p class="cg t2">Another description</p>
    <span class="c1 tb">$29.99</span>
  </a>
</section>
```

### 11. Dynamic List (Runtime Data Only)

**Only use for data that changes after page load:**

```html
<ul data-m-bind="cart" data-m-tpl="cart-tpl" data-m-key="id" class="f fc g2"></ul>
<template id="cart-tpl">
  <li class="f fi fb p3 bg r">
    <span data-m-f="name"></span>
    <button data-m-on="click:removeItem" class="c4 t2">Remove</button>
  </li>
</template>
```

## CSS Organization

### Small Sites (1-3 pages)

Inline all CSS in each page's `<head>`:

```html
<head>
  <style>/* all utility classes + theme + page-specific */</style>
</head>
```

### Larger Sites (4+ pages)

Extract shared CSS to `site.css`, inline only page-critical:

```
bookstore/
  index.html
  checkout.html
  confirm.html
  styles/
    site.css      # shared: utilities, theme, components
```

**site.css structure:**
```css
/* 1. Reset & base */
*,*::before,*::after{box-sizing:border-box}
body{margin:0;font-family:system-ui,sans-serif}

/* 2. CSS custom properties (theme) */
:root{--m-p:#0066ff;--m-s:#6c757d;--m-ok:#28a745;--m-err:#dc3545}
html.dark{--m-bg:#1a1a1a;--m-fg:#f5f5f5;--m-p:#5c9eff}

/* 3. Utility classes */
.f{display:flex}.fc{flex-direction:column}/* etc */

/* 4. Shared patterns (cards, buttons, forms) */
.card{background:#f5f5f5;border-radius:8px;padding:1rem}
```

**Page head:**
```html
<head>
  <link rel="stylesheet" href="styles/site.css">
  <style>/* page-specific critical CSS only */</style>
</head>
```

### CSS Scoping

No Shadow DOM needed. Use these patterns:

**1. Utility classes** - Naturally scoped by usage
```html
<div class="f fc g3 p3 bg r">
```

**2. CSS custom properties** - Theme values
```css
:root{--m-p:#0066ff}
.c1{color:var(--m-p)}
```

**3. Pattern prefixes** - For site-specific patterns
```css
.recipe-card{...}
.recipe-card-title{...}
.recipe-card-meta{...}
```

### Web Components (Future)

If Shadow DOM isolation is needed later:
- Define as `<m-component>` custom elements
- Use `:host` for component root styling
- Pass data via attributes or properties

For now, utility classes + CSS custom properties provide sufficient isolation.

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
