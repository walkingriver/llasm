# LLuMe Architecture — One Right Way

- Every page is a static HTML file (full content) + manifest + optional handlers
- On client: llume.js parses manifest → attaches behaviors ONLY via data-m-enhance and data-m-bind
- SSR: Node/Deno function renderStatic(manifest) → full HTML string
- No virtual DOM after initial mount. Only keyed DOM diffing for state changes
- Size budget: ≤ 9 KB gzipped
- All rich widgets are implemented by the runtime upgrading native elements based on data-m-enhance values
- No m- tags are ever emitted by the generator LLM
- No "cmp" section in manifest
