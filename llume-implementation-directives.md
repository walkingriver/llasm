# Implementation Directives

- Use native Proxy + MutationObserver
- CSS: only CSS custom properties from manifest "t" + one <style> block with predefined media queries (320, 768, 1024, 1440)
- a11y: automatic role/aria-\* decision table based on tag + enhance flags
- Validation: runs on every l.u() and form submit
- Hydration: selective — only elements with data-m-enhance, data-m-bind, or e: get JS
- No "cmp" map, no m- tags, no user-defined custom elements
- Routing: static HTML files only. Inter-page = normal <a href>. Intra-page = hash fragments + data-m-section
