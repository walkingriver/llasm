# LLasM - LLM Assembly Language

**A framework optimized for LLM code generation, not human developers.**

## Core Mission

Existing frameworks were built to make web development easier for humans. LLasM flips this: minimal API surface, one way to do each thing, patterns over configuration, terse predictable syntax.

## Design Principles (Priority Order)

Higher tiers override lower tiers when conflicts arise.

### Tier 1: SECURITY
- **OWASP Compliant** - Follow OWASP Top 10. Defense in depth.
- **Safe Binding** - No innerHTML. Sanitize all dynamic content.
- **No UI Cookies** - Auth is server-side (httpOnly/secure).
- **Zero Trust Input** - Validate and sanitize all user input and URL params.
- **Network Resilience** - Handle fetch failures gracefully.

### Tier 2: ACCESSIBILITY
- **WCAG Compliant** - WCAG 2.1 AA minimum. ARIA, keyboard nav, focus management.
- **I18n Ready** - Locale keys with RTL support.
- **Semantic Elements** - Use native HTML5 (nav, main, article, section).
- **Responsive** - Fluid layouts, mobile-first breakpoints.

### Tier 3: QUALITY
- **ATOMIC Design** - Atoms + molecules shipped. Organism patterns documented.
- **Page-Level Routing** - Each page is a file. Deep-linking by default.
- **Self-Booting Pages** - Every page hydrates independently.
- **Lighthouse 90+** - All four categories.
- **SEO Ready** - Meta tags, Open Graph, structured data.

### Tier 4: PERFORMANCE
- **LLM-First** - Code for LLMs by LLMs. Human readability is a non-goal.
- **One Way** - Single canonical approach. No alternatives.
- **Terse by Default** - 1-3 char identifiers: `f fc g3` not `flex flex-col gap-3`.
- **Zero Build** - HTML + ES + CSS only. No transpilation.
- **CSS Before JS** - If CSS can do it, don't use JS.
- **Browser-Native** - Only browser APIs. No external libraries.
- **Patterns Over Libs** - LLMs need patterns, not helper libraries.

## REQUIRED CHECKLIST

Every LLasM page MUST include ALL of these. Do not skip any.

1. **Folder per app** - Each app gets its own folder with `index.html` as entry point
2. **Separate files** - Each view/page is a separate HTML file (NO hash routing between pages)
3. **Cache-bust import** - Random 8-char hash: `import{l}from"../../llasm.js?v=x9k2m4p7";`
4. **Build date footer** - `<p class="t1 o5">Built 2026-02-17</p>` with today's date
5. **Critical CSS in head** - Inline `<style>` with utility classes used above fold
6. **Dark mode script in head** - Blocking script before body renders
7. **theme-color meta** - `<meta name="theme-color" content="#0066ff">`
8. **Semantic footer** - `<footer>` element with copyright/version
9. **No inline styles** - Use utility classes, not `style="..."`

## File Organization

Every app lives in its own folder under `docs/examples/`:

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

### Rules

1. **One folder per app** - `docs/examples/{app-name}/`
2. **Entry point is `index.html`** - Main/home view
3. **Short page names** - `checkout.html` not `bookstore-checkout.html`
4. **llasm.js path** - `../../llasm.js` (relative to app folder)

### Navigation Between Pages

```html
<!-- Within same app folder -->
<a href="checkout.html">Checkout</a>
<a href="detail.html?id=123">View Details</a>

<!-- Back to index -->
<a href="./">Back to Home</a>
```

### Required Head Structure

```html
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="description" content="Page description">
  <meta name="theme-color" content="#0066ff">
  <title>Page Title</title>
  <script>/* dark mode detection */</script>
  <style>/* critical CSS */</style>
</head>
```

### Required Footer Structure

```html
<footer class="xw3 mxa py4 tc cg t2">
  <p>&copy; 2026 Site Name</p>
  <p class="t1 o5">Built 2026-02-17</p>
</footer>
```

## Quick Start

Read `SKILL.md`, generate HTML with embedded manifest:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="description" content="Page description for SEO">
  <meta name="theme-color" content="#0066ff">
  <title>Page Title</title>
  <script>try{var d=localStorage.getItem('llasm-dark');if(d==='true'||(d===null&&matchMedia('(prefers-color-scheme:dark)').matches))document.documentElement.classList.add('dark');}catch(e){}</script>
  <style>/* critical CSS - see SKILL.md */</style>
</head>
<body class="p3">
  <header class="xw3 mxa f fb fi py3">
    <h1 class="t5 c1 tb">Site Name</h1>
  </header>

  <main class="xw3 mxa f fc g3">
    <h2 class="t4 tb" data-m-bind="title"></h2>
    <p class="cg" data-m-bind="desc"></p>
    <button data-m-on="click:save" class="b1 cw p2 px3 r">Save</button>
  </main>

  <footer class="xw3 mxa py4 tc cg t2">
    <p>&copy; 2026 Site Name</p>
    <p class="t1 o5">Built 2026-02-17</p>
  </footer>

  <script type="application/llasm+json" id="manifest">
  {"v":1,"r":{"s":{"title":"Hello","desc":"World"}},"l":{"en":{}}}
  </script>
  <script type="module">
  import{l}from"./llasm.js?v=a7f3b2c1";
  l.h({save:(e,s,L)=>L.t('Saved!','ok')});
  </script>
</body>
</html>
```

## Static HTML First

**When data is known, render static HTML. Do NOT use templates or data binding.**

```html
<!-- GOOD: Static HTML with real links -->
<a href="detail.html?id=1" class="bg r2 sh p3 tdn cb">
  <h2 class="t4 tb">Recipe Name</h2>
</a>

<!-- BAD: Template for known data -->
<section data-m-bind="recipes" data-m-tpl="tpl"></section>
```

### When to Use Templates

Only for runtime data:
- API responses
- User-generated content (cart, forms)
- Data that changes after load

### Navigation

- **Always `<a href>`** - Never click handlers for navigation
- **Never invent attributes** - Only use documented `data-m-*` attributes

## Valid Attributes

Only these `data-m-*` attributes exist. Do NOT invent others.

| Attribute | Purpose |
|-----------|---------|
| `data-m-bind` | Bind state to element |
| `data-m-on` | Event binding |
| `data-m-if` | Conditional rendering |
| `data-m-class` | Conditional CSS class |
| `data-m-enhance` | Enhancement flags |
| `data-m-tpl` | Template ID for lists |
| `data-m-key` | Key field for list diffing |
| `data-m-f` | Field name in template |
| `data-m-tx` | i18n text key |
| `data-m-route` | Hash route section |

## Syntax Reference

### Data Binding
```html
<span data-m-bind="userName"></span>
<span data-m-bind="user.name"></span>
<span data-m-bind="name|upper"></span>
```

### Conditional Rendering

**NEVER use inline styles (`style.display='none'`) for visibility. Use CSS classes.**

**data-m-if** - Element visibility (runtime adds `.m-hide` class):
```html
<div data-m-if="loading">Loading...</div>
<div data-m-if="!loading">Content</div>
```

**data-m-class** - Conditional CSS classes:
```html
<button data-m-class="b1:!loading, b2:loading">Submit</button>
```

**Ancestor-based styling** (preferred for complex states):
```html
<article data-m-class="is-editing:editing" class="p3 bg r">
  <h2 class="view-mode">Title</h2>
  <input class="edit-mode">
</article>
```
```css
.edit-mode{display:none}
.is-editing .edit-mode{display:block}
.is-editing .view-mode{display:none}
```

Single class on parent controls all descendants via CSS.

### Event Binding
```html
<button data-m-on="click:save">Save</button>
<input data-m-on="input:update,blur:validate">
<form data-m-on="submit:send">
```

Use actual DOM event names (click, input, blur, submit, etc.) - LLMs already know them.

### List Rendering
```html
<ul data-m-bind="items" data-m-tpl="item-tpl" data-m-key="id" class="f fc g2"></ul>
<template id="item-tpl">
  <li class="f fb fi p2 bg r">
    <span data-m-f="name"></span>
    <span class="c1 tb" data-m-f="price"></span>
  </li>
</template>
```

### Utility Classes (Tailwind-Lite)
```html
<div class="f fc g3 p3 bg r">
  <h1 class="t6 tb c1">Title</h1>
</div>
```

Layout: `f` flex | `fc` column | `fi` center | `fj` justify | `fg` grow
Spacing: `p1-p5` padding | `m1-m5` margin | `g1-g5` gap
Typography: `t1-t7` size | `tb` bold | `tc` center
Colors: `c1` primary | `cg` gray | `b1` bg-primary | `bg` bg-gray
Effects: `r` radius | `sh` shadow | `bd` border

## State Management

Three-tier storage:
```json
{
  "v": 1,
  "r": {"s": {"cart": [], "user": null}},
  "persist": {"cart": "local", "user": "session"}
}
```

- `session` - sessionStorage (tab lifetime)
- `local` - localStorage (browser lifetime)
- `server` - fetch to API (permanent)

## Page-Level Routing

**Each page is a separate HTML file. Do NOT use hash routing between pages.**

Each page:
- Self-boots independently (works if loaded directly)
- Shares state via `persist: {"cart": "local"}`
- Links to other pages with `<a href="checkout.html">`

### Passing Data Between Pages

Use URL params for IDs, localStorage for complex data:

```html
<!-- Link with ID -->
<a href="detail.html?id=123">View Recipe</a>
```

```javascript
// In detail.html handler
const id = new URLSearchParams(location.search).get('id');
```

### When Hash Routing IS Allowed

Only for tabs/panels within a single page:
```html
<section data-m-if="tab==info">Info Tab</section>
<section data-m-if="tab==settings">Settings Tab</section>
```

NOT for separate views (shop vs checkout vs confirmation).

## Files

| File | Purpose |
|------|---------|
| `SKILL.md` | Frontend generation (primary) |
| `SKILL-API.md` | REST API generation |
| `SKILL-SSR.md` | Server-side rendering |
| `llasm.js` | Runtime |
| `reference/` | Detailed specs |

## Performance Rules

- **Images**: WebP, explicit width/height, lazy loading
- **Animations**: Only transform/opacity (composited)
- **CSS**: Inline critical CSS in head
- **Caching**: Service worker, stale-while-revalidate
