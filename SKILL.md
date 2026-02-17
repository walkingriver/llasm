---
name: llasm
version: 1.2.0
description: Generate complete, interactive web pages using the LLasM framework (LLM Assembly Language). Use when the user wants to build a website, web page, web app, landing page, form, dashboard, or any browser-based UI. LLasM outputs static HTML with embedded manifest and optional handlers - zero build, pure browser ESM.
homepage: https://llasm.dev
repository: https://github.com/walkingriver/llasm
---

# LLasM Page Generator

Generate complete, production-ready web pages. Output is always a single HTML file that works directly in browsers.

## Output Structure

Every LLasM page has exactly three parts:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Page Title</title>
</head>
<body class="p3">
  <!-- 1. STATIC HTML: Complete semantic markup with utility classes -->
  <main class="xw3 mxa f fc g3">
    <h1 class="t6 c1 tb" data-m-tx="ti"></h1>
    <button data-m-on="click:save" data-m-enhance="primary ripple">Save</button>
    <div data-m-if="items.length==0" class="p3 bg r tc">No items</div>
    <ul data-m-bind="items" data-m-tpl="tpl" data-m-key="id" class="f fc g1"></ul>
  </main>

  <!-- 2. MANIFEST: Minified JSON with state, i18n, theme, persistence -->
  <script type="application/llasm+json" id="manifest">{"v":1,"r":{"s":{"items":[]}},"persist":["items"],"l":{"en":{"ti":"Hello"}},"t":{"--m-p":"#0066ff"}}</script>

  <!-- 3. RUNTIME + HANDLERS: Optional, <500 bytes -->
  <script type="module">
  import{l}from"./llasm.js";
  l.h({save:(e,s,L)=>{L.u({saved:true});L.t('Saved!','ok');}});
  </script>
</body>
</html>
```

## Critical Rules

1. **Never use `m-` tags** - only native HTML elements
2. **Use utility classes for styling** - terse 1-3 char classes (`f fc g3 p3 bg r`)
3. **Always emit complete HTML** - page must work without JavaScript
4. **Use 1-2 letter keys** in manifest (`v`, `l`, `t`, `s`, `e`, `b`, `tx`, `a`, `c`)
5. **Handlers must be ≤500 bytes** minified
6. **Use data-m-on for events** - not onclick="window._fn()"

## Data Attributes

| Attribute | Purpose | Example |
|-----------|---------|---------|
| `data-m-tx` | i18n text key | `data-m-tx="title"` |
| `data-m-bind` | Two-way state binding | `data-m-bind="count"` |
| `data-m-bind` | With pipe transform | `data-m-bind="name\|upper"` |
| `data-m-bind` | Nested state | `data-m-bind="user.name"` |
| `data-m-on` | Event binding | `data-m-on="click:save"` |
| `data-m-on` | Multiple events | `data-m-on="input:typing,blur:validate"` |
| `data-m-enhance` | Enhancement flags | `data-m-enhance="primary ripple"` |
| `data-m-route` | Hash routing section | `data-m-route="/about"` |
| `data-m-route` | With params | `data-m-route="/hero/:id"` |
| `data-m-if` | Conditional rendering | `data-m-if="showDetail"` |
| `data-m-if` | Negated condition | `data-m-if="!loading"` |
| `data-m-if` | Array length check | `data-m-if="items.length==0"` |
| `data-m-if` | Comparison | `data-m-if="status==active"` |
| `data-m-class` | Conditional CSS class | `data-m-class="active:isActive"` |
| `data-m-class` | Equality check | `data-m-class="sel:selectedId==id"` |
| `data-m-tpl` | Template ID for lists | `data-m-tpl="item-tpl"` |
| `data-m-key` | Key field for list diffing | `data-m-key="id"` |
| `data-m-f` | Field name in template | `data-m-f="name"` |

## Pipes (Transforms)

Use with `data-m-bind="key|pipe"`:

| Pipe | Effect |
|------|--------|
| `upper` | UPPERCASE |
| `lower` | lowercase |
| `title` | Title Case |
| `trim` | Remove whitespace |

## Enhancement Flags

Use `data-m-enhance="flag1 flag2"` on native elements:

| Flag | Element | Effect |
|------|---------|--------|
| `primary` | button | Primary button styling |
| `secondary` | button | Secondary button styling |
| `ripple` | button | Material ripple on click |
| `disabled` | any | Disabled state + ARIA |
| `autofocus` | input | Auto-focus on mount |
| `validate` | button | Form validation trigger |
| `combobox` | div | Filterable dropdown (contains input + ul) |
| `modal` | dialog/div | Modal with focus trap |
| `tabs` | div | Tab container (button[data-m-tab] + div[data-m-panel]) |
| `accordion` | div | Accordion (div[data-m-acc] items) |
| `disclosure` | div | Expandable content |
| `tooltip` | div | Tooltip on hover/focus |
| `progress` | div | Progress bar |
| `date` | input | Date picker |
| `darkmode` | button | Dark mode toggle (persists) |
| `toast` | div | Toast container (auto-created) |

## Manifest Schema

```json
{
  "v": 1,
  "r": { "s": { "count": 0, "items": [] } },
  "persist": ["items"],
  "l": { "en": {"key":"Text"}, "es": {"key":"Texto"} },
  "t": { "--m-p":"#0066ff", "--m-s":"#6c757d" }
}
```

| Key | Purpose |
|-----|---------|
| `v` | Version (always 1) |
| `r.s` | Initial state |
| `persist` | State keys saved to localStorage |
| `l` | Locales: `{"locale": {"key": "text"}}` |
| `t` | Theme: CSS custom properties |

## Runtime API

Handlers receive `(event, state, L, element)` where `L` is the runtime:

| Method | Purpose |
|--------|---------|
| `L.u(patch)` | Update state |
| `L.t(msg,type,ms)` | Show toast (`'ok'`, `'err'`, `'info'`) |
| `L.r(locale)` | Switch locale |
| `L.s()` | Get state snapshot |
| `L.p()` | Get route params (e.g., `{id:"123"}`) |
| `L.nav(hash)` | Navigate to hash route |
| `L.q(sel)` | Query element |
| `L.vf(form)` | Validate form → `{v:bool, e:[]}` |
| `L.f(url,opts)` | Fetch with retry |

## Built-in State

| Key | Type | Description |
|-----|------|-------------|
| `_offline` | boolean | `true` when browser is offline |

```html
<span data-m-if="_offline">You're offline</span>
```

## Utility Classes (Tailwind-lite)

Use terse 1-3 character class names for styling. No custom CSS needed.

### Layout
`f` flex | `fc` flex-col | `fw` flex-wrap | `fi` items-center | `fj` justify-center | `fb` space-between | `fg` flex-grow

### Grid
`g` grid | `gc2-gc6` grid-cols | `gr2-gr3` grid-rows

### Spacing
`g1-g5` gap | `p1-p5` padding | `px1-px5` padding-x | `py1-py5` padding-y | `m1-m5` margin | `ma` margin-auto | `mxa` margin-x-auto

### Sizing
`wf` width-full | `wh` width-half | `xw1-xw5` max-width | `hf` height-full | `hv` height-100vh

### Typography
`t1-t7` font-size | `tc` text-center | `tb` bold | `tu` uppercase | `ell` ellipsis | `ln2` line-clamp-2

### Colors
`c1-c4` color (primary/secondary/ok/err) | `cw` white | `cb` black | `cg` gray

### Background
`b1-b4` bg (primary/secondary/ok/err) | `bw` white | `bb` black | `bg` gray

### Effects
`r` radius | `rf` radius-full | `sh` shadow | `bd` border | `tr` transition

### Animations
`spin` spinner | `pulse` pulsing | `fade` fade-in

### Display
`dn` none | `db` block | `rel` relative | `abs` absolute | `cp` cursor-pointer

### Responsive (sm: prefix for <768px)
`sm:dn` hide | `sm:db` show | `sm:fc` column | `sm:wf` full-width | `sm:gc1` single-col

For full list, see [reference/utility-classes.md](reference/utility-classes.md)

## Common Patterns

### Loading State
```html
<div data-m-if="loading" class="f fj fi g2">
  <div class="spin b1 r" style="width:24px;height:24px"></div>
  <span class="cg">Loading...</span>
</div>
<div data-m-if="!loading">Content here</div>
```

### Empty State
```html
<div data-m-if="items.length==0" class="p4 bg r tc cg">No items yet</div>
<ul data-m-if="items.length>0" data-m-bind="items" ...></ul>
```

### Toast Notification
```javascript
L.t('Saved!', 'ok');           // success
L.t('Error occurred', 'err');  // error
L.t('Info message', 'info');   // info
```

### Dark Mode Toggle
```html
<button data-m-enhance="darkmode secondary">Toggle Dark</button>
```

### Persisted State
```json
{"v":1,"r":{"s":{"items":[]}},"persist":["items"]}
```

## Examples

For complete examples, see:
- [examples/features-demo.html](examples/features-demo.html) - All v1.2 features
- [examples/tour-of-heroes.html](examples/tour-of-heroes.html) - Full app
- [examples/todo-app.html](examples/todo-app.html) - Persistent todos
- [examples/landing-page.html](examples/landing-page.html)
- [examples/contact-form.html](examples/contact-form.html)
- [examples/minimal-card.html](examples/minimal-card.html) - Utility classes

## Performance Best Practices

Follow these rules to achieve optimal Lighthouse scores:

### Images
- **Always use WebP format** with quality 10-25 for decorative/background images, 40-60 for important visuals
- **Always specify width and height attributes** on `<img>` elements to prevent CLS (Cumulative Layout Shift)
- **Preload hero/LCP images** with `<link rel="preload" as="image" href="..." fetchpriority="high">`
- **Use responsive sizing** with `style="height:min(400px,50vh);object-fit:cover"` for hero images

### CSS Animations
- **Only animate compositable properties**: `transform` and `opacity`
- **Never animate**: `color`, `background`, `background-color`, `width`, `height`, `margin`, `padding`, `top`, `left`, etc.
- **Avoid body-level transitions** - they cause non-composited animation warnings

### Layout Stability (CLS)
- **Explicit dimensions** on all images and media elements
- **Reserve space** for dynamic content with min-height or aspect-ratio
- **Avoid injecting content above existing content** after page load
- **Dark mode detection in head** - Add inline script to detect and apply dark mode before body renders

### Dark Mode & Accessibility
- **Color contrast** - Dark mode primary color `#5c9eff` provides 5.4:1 contrast on `#2a2a2a` background (WCAG AA compliant)
- **Apply dark mode early** - Use blocking inline script in `<head>` to prevent flash and CLS:
  ```html
  <script>try{var d=localStorage.getItem('llasm-dark');if(d==='true'||(d===null&&window.matchMedia&&matchMedia('(prefers-color-scheme:dark)').matches))document.documentElement.classList.add('dark');}catch(e){}</script>
  <style>html.dark{--m-bg:#1a1a1a;--m-fg:#f5f5f5;--m-p:#5c9eff;background:var(--m-bg);color:var(--m-fg)}html.dark body{background:var(--m-bg);color:var(--m-fg)}html.dark .bg{background:#2a2a2a}html.dark .cg{color:#aaa}</style>
  ```
- **Dark mode class on html** - Apply `.dark` class to `document.documentElement` (html), not body, for earliest rendering
- **Minimum contrast ratios**:
  - Large text (18pt/24px+ or 14pt/18.66px+ bold): 3:1 minimum
  - Normal text: 4.5:1 minimum
  - UI components and graphics: 3:1 minimum

### Head Element Order
```html
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="description" content="...">
  <meta name="theme-color" content="#0066ff">
  <link rel="preload" as="image" href="img/hero.webp" type="image/webp" fetchpriority="high">
  <title>Page Title</title>
</head>
```

### Critical Inline CSS
For production pages, include critical CSS inline in `<head>` to prevent CLS:
- Box-sizing reset, CSS custom properties, font-family
- Layout classes used above the fold (`f`, `fc`, `fi`, `fj`, `fb`, `g`, `gc2`, `gc3`)
- Spacing classes (`p2-p4`, `px2-px4`, `py1-py5`, `g1-g3`, `mxa`)
- Typography (`t1-t7`, `tc`, `tb`)
- Colors (`c1`, `cg`, `cw`, `b1`, `bg`, `bw`)
- Position (`rel`, `abs`, `stk`, `t0`, `r0`, `b0`, `l0`, `z3`)
- Responsive breakpoints (`@media(max-width:768px)`)

## Versioning & Cache Busting

### VERSION.json
Track builds with a simple JSON file at project root:
```json
{
  "build": 1,
  "date": "2026-02-17T12:00:00Z",
  "hash": "abc1234"
}
```

### Version Bumping Workflow
When deploying changes:
1. Increment `build` number in `VERSION.json`
2. Update `date` to current ISO timestamp
3. Update `hash` to current git commit hash (first 7 chars)
4. Update footer `data-m-version` element: `Build {n} · {date}`
5. Update `llasm.js` import query string: `./llasm.js?v={build}`

### Cache Busting
Use query string versioning on the llasm.js import:
```html
<script type="module">
  import{l}from"./llasm.js?v=1";
</script>
```
Increment the version number with each build to bust browser cache.

## File Output

When generating a page, also copy `llasm.js` alongside it:
- Read `llasm.js` from this skill directory
- Write it next to the generated HTML
- Reference as `./llasm.js?v={build}` in the script import
