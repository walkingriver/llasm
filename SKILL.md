---
name: llume
description: Generate complete, interactive web pages using the LLuMe framework. Use when the user wants to build a website, web page, web app, landing page, form, dashboard, or any browser-based UI. LLuMe outputs static HTML with embedded manifest and optional handlers - zero build, pure browser ESM.
---

# LLuMe Page Generator

Generate complete, production-ready web pages. Output is always a single HTML file that works directly in browsers.

## Output Structure

Every LLuMe page has exactly three parts:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Page Title</title>
</head>
<body>
  <!-- 1. STATIC HTML: Complete semantic markup, works without JS -->
  <main>
    <h1 data-m-tx="ti"></h1>
    <button data-m-enhance="primary ripple">Click</button>
  </main>

  <!-- 2. MANIFEST: Minified JSON with state, i18n, theme -->
  <script type="application/llume+json" id="manifest">{"v":1,"l":{"en":{"ti":"Hello"}},"t":{"--m-p":"#0066ff"}}</script>

  <!-- 3. RUNTIME + HANDLERS: Optional, <500 bytes -->
  <script type="module">
  import{l}from"./llume.js";
  l.h({f1:(e,s,L)=>{L.u({count:s.count+1});}});
  </script>
</body>
</html>
```

## Critical Rules

1. **Never use `m-` tags** - only native HTML elements
2. **Never use `class` attributes** - styling via CSS custom properties only
3. **Always emit complete HTML** - page must work without JavaScript
4. **Use 1-2 letter keys** in manifest (`v`, `l`, `t`, `s`, `e`, `b`, `tx`, `a`, `c`)
5. **Handlers must be ≤500 bytes** minified

## Data Attributes

| Attribute | Purpose | Example |
|-----------|---------|---------|
| `data-m-tx` | i18n text key | `data-m-tx="title"` |
| `data-m-bind` | Two-way state binding | `data-m-bind="count"` |
| `data-m-bind` | With pipe transform | `data-m-bind="name\|upper"` |
| `data-m-enhance` | Enhancement flags | `data-m-enhance="primary ripple"` |
| `data-m-route` | Hash routing section | `data-m-route="/about"` |
| `data-m-route` | With params | `data-m-route="/hero/:id"` |
| `data-m-if` | Conditional rendering | `data-m-if="showDetail"` |
| `data-m-if` | Negated condition | `data-m-if="!loading"` |
| `data-m-class` | Conditional CSS class | `data-m-class="selected:isActive"` |
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
| `tabs` | div | Tab container (contains button[data-m-tab] + div[data-m-panel]) |
| `accordion` | div | Accordion (contains div[data-m-acc] items) |
| `disclosure` | div | Expandable content |
| `tooltip` | div | Tooltip on hover/focus |
| `progress` | div | Progress bar |
| `date` | input | Date picker |

## Manifest Schema

```json
{
  "v": 1,
  "l": { "en": {"key":"Text"}, "es": {"key":"Texto"} },
  "t": { "--m-p":"#0066ff", "--m-s":"#6c757d" },
  "r": {
    "s": { "count": 0, "items": [] }
  }
}
```

| Key | Purpose |
|-----|---------|
| `v` | Version (always 1) |
| `l` | Locales: `{"locale": {"key": "text"}}` |
| `t` | Theme: CSS custom properties |
| `r.s` | Initial state |

## Runtime API

Handlers receive `(event, state, L)` where `L` is the runtime:

| Method | Purpose |
|--------|---------|
| `L.u(patch)` | Update state |
| `L.r(locale)` | Switch locale |
| `L.s()` | Get state snapshot |
| `L.p()` | Get route params (e.g., `{id:"123"}`) |
| `L.nav(hash)` | Navigate to hash route |
| `L.q(sel)` | Query element |
| `L.vf(form)` | Validate form → `{v:bool, e:[]}` |
| `L.f(url,opts)` | Fetch with retry |

## Utility Classes (Tailwind-lite)

Use terse 1-3 character class names for styling. No custom CSS needed.

### Layout
`f` flex | `fc` flex-col | `fw` flex-wrap | `fi` items-center | `fj` justify-center | `fb` space-between

### Spacing
`g1-g5` gap | `p1-p5` padding | `px1-px5` padding-x | `py1-py5` padding-y | `m1-m5` margin | `ma` margin-auto | `mxa` margin-x-auto

### Sizing
`wf` width-full | `wh` width-half | `xw1-xw5` max-width | `hf` height-full | `hv` height-100vh

### Typography
`t1-t7` font-size | `tc` text-center | `tb` bold | `tu` uppercase

### Colors
`c1-c4` color (primary/secondary/ok/err) | `cw` white | `cb` black | `cg` gray

### Background
`b1-b4` bg (primary/secondary/ok/err) | `bw` white | `bb` black | `bg` gray

### Effects
`r` radius | `rf` radius-full | `sh` shadow | `bd` border

### Display
`dn` none | `db` block | `rel` relative | `abs` absolute | `cp` cursor-pointer

For full list, see [reference/utility-classes.md](reference/utility-classes.md)

## Examples

For complete examples, see:
- [examples/minimal-card.html](examples/minimal-card.html) - Utility classes demo
- [examples/tour-of-heroes.html](examples/tour-of-heroes.html) - Full app
- [examples/todo-app.html](examples/todo-app.html)
- [examples/landing-page.html](examples/landing-page.html)
- [examples/contact-form.html](examples/contact-form.html)

## File Output

When generating a page, also copy `llume.js` alongside it:
- Read `llume.js` from this skill directory
- Write it next to the generated HTML
- Reference as `./llume.js` in the script import
