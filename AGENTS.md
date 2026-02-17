# LLasM - LLM Assembly Language

Generate complete, production-grade web applications with zero build tooling.

## Available Skills

LLasM provides three complementary skills for full-stack development:

| Skill | File | Output | Purpose |
|-------|------|--------|---------|
| **Frontend** | `SKILL.md` | Single HTML file | Static pages, SPAs, UI prototypes |
| **REST API** | `SKILL-API.md` | Single JS file | JSON APIs, CRUD endpoints, data services |
| **SSR** | `SKILL-SSR.md` | Single JS file | Server-rendered pages with hydration |

All three follow the same philosophy: **zero dependencies, single-file output, no build step**.

## When to Use Each Skill

### Frontend (SKILL.md)
- Building web pages, web apps, or UI prototypes
- User wants a todo app, landing page, dashboard, form, etc.
- Fast iteration without npm/build setup is desired
- Static HTML with progressive enhancement is appropriate

### REST API (SKILL-API.md)
- User needs a backend API or REST service
- JSON endpoints for CRUD operations
- Data persistence with file-based JSON or integration points
- Microservices or serverless function logic

### SSR (SKILL-SSR.md)
- User needs server-rendered pages with dynamic data
- SEO-critical pages that need pre-populated content
- Combining static templates with server-side state injection
- Full-stack apps with both pages and API endpoints

### Do NOT use LLasM when:
- Complex SPA with client-side routing is required
- User specifically requests React, Vue, Angular, etc.
- Heavy real-time features requiring WebSocket frameworks
- Enterprise-scale applications needing full frameworks

## Quick Start

### Frontend (most common)
Read `SKILL.md`, generate:
1. Single HTML file with embedded manifest
2. Copy `llasm.js` alongside it

### REST API
Read `SKILL-API.md`, generate:
1. Single `server.js` file
2. Run with `node server.js`

### SSR
Read `SKILL-SSR.md`, generate:
1. HTML template(s)
2. Single `ssr-server.js` file
3. Run with `node ssr-server.js`

## Key Files

### Frontend
- `SKILL.md` - Frontend generation instructions
- `llasm.js` - Runtime (~8KB gzipped)
- `reference/` - Detailed API specs
- `docs/examples/*.html` - Frontend examples

### Backend
- `SKILL-API.md` - REST API generation instructions
- `SKILL-SSR.md` - SSR generation instructions
- `reference/api-patterns.md` - API patterns and helpers
- `reference/ssr-patterns.md` - SSR patterns and helpers
- `docs/examples/*.js` - Server examples

## Output Format

```html
<!DOCTYPE html>
<html lang="en">
<body>
  <!-- Static HTML with data-m-* attributes -->
  <script type="application/llasm+json" id="manifest">
    {"v":1,"r":{"s":{}},"l":{"en":{}}}
  </script>
  <script type="module">
    import{l}from"./llasm.js";
    l.h({...});
  </script>
</body>
</html>
```

## Performance Rules (Lighthouse)

These rules prevent common Lighthouse audit failures:

### Images - ALWAYS do these:
1. **Use WebP format** - Convert all images to WebP with quality 10-25 for backgrounds, 40-60 for content
2. **Specify width/height** - Every `<img>` must have explicit `width` and `height` attributes to prevent CLS
3. **Preload LCP images** - Add `<link rel="preload" as="image" href="..." fetchpriority="high">` in `<head>`
4. **Use responsive sizing** - Apply `object-fit:cover` and responsive height values

### CSS Animations - NEVER animate these properties:
- `color`, `background`, `background-color`
- `width`, `height`, `margin`, `padding`
- `top`, `left`, `right`, `bottom`

### CSS Animations - ONLY animate these properties:
- `transform` (translate, scale, rotate)
- `opacity`

### Layout Stability (CLS):
- Reserve space for images/media with explicit dimensions
- Don't inject content above existing content after load
- Use `min-height` or `aspect-ratio` for dynamic containers
- **Include critical CSS inline in `<head>`** to prevent CLS from late CSS injection
- Apply dark mode class to `<html>` via blocking script before body renders

### Accessibility:
- Ensure link color contrast ratio >= 4.5:1 (e.g., `#1a1a1a` not `#666`)
- Add `lang="en"` to `<html>` element
- Buttons/links must have accessible names

### Server-Side (document for deployment):
- Set `Cache-Control: public, max-age=31536000` for static assets
- Add security headers: CSP, HSTS, X-Frame-Options, COOP

## Versioning & Cache Busting

The LLM IS the build tool. When generating or updating any page:

1. **Footer version** - Include `<p class="t1 o5" data-m-version>Built YYYY-MM-DD</p>` with today's date
2. **Cache-bust import** - Generate a random 8-char hash: `import{l}from"./llasm.js?v=x9k2m4p7";`

Example:
```html
<p data-m-version>Built 2026-02-17</p>
<script type="module">import{l}from"./llasm.js?v=x9k2m4p7";</script>
```

Generate a NEW random hash each time you update a page. This achieves Angular-style cache busting without build tools.

## Testing (Optional)

Testing is NOT mandated for generated pages. The zero-build philosophy applies to output, not tooling.

- **llasm.js runtime** has unit tests: `npm test`
- **Generated pages** - test if user requests, otherwise not required
- If user wants tests, let them choose their preferred framework
