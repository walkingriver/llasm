# LLasM - LLM Assembly Language

Generate complete, production-grade web pages with zero build tooling.

## When to Use

Use this skill when:
- Building web pages, web apps, or UI prototypes
- User wants a todo app, landing page, dashboard, form, etc.
- Fast iteration without npm/build setup is desired
- Static HTML with progressive enhancement is appropriate

Do NOT use when:
- Complex SPA with client-side routing is required
- User specifically requests React, Vue, Angular, etc.
- Server-side logic beyond static pages is needed

## Quick Start

Read `SKILL.md` for complete generation rules.

Generate:
1. Single HTML file with embedded manifest
2. Copy `llasm.js` alongside it

That's it. No build step.

## Key Files

- `SKILL.md` - Full generation instructions
- `llasm.js` - Runtime (~8KB gzipped)
- `reference/` - Detailed API specs
- `examples/` - Few-shot learning examples

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

### Accessibility:
- Ensure link color contrast ratio >= 4.5:1 (e.g., `#1a1a1a` not `#666`)
- Add `lang="en"` to `<html>` element
- Buttons/links must have accessible names

### Server-Side (document for deployment):
- Set `Cache-Control: public, max-age=31536000` for static assets
- Add security headers: CSP, HSTS, X-Frame-Options, COOP
