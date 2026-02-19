# LLasM Roadmap

## Design Philosophy

**A framework optimized for LLM code generation, not human developers.**

### Priority Tiers

1. **SECURITY** - OWASP, safe binding, no UI cookies, zero trust input
2. **ACCESSIBILITY** - WCAG 2.1 AA, semantic elements, i18n
3. **QUALITY** - Lighthouse 90+, self-booting pages, SEO
4. **PERFORMANCE** - LLM-first, one way, terse, zero build, CSS before JS

### Core Principles

- **LLM-First** - Code for LLMs by LLMs. Human readability is a non-goal.
- **One Way** - Single canonical approach. No alternatives.
- **Terse by Default** - 1-3 char identifiers: `f fc g3` not `flex flex-col gap-3`
- **Zero Build** - HTML + ES + CSS only. No transpilation.
- **CSS Before JS** - If CSS can do it, don't use JS.
- **Browser-Native** - Only browser APIs. No external libraries.
- **Patterns Over Libs** - LLMs need patterns, not helper libraries.

---

## Philosophy Decisions

### Event Binding
**Decision: Use actual DOM event names.**
- `data-m-on="click:handler"` not abbreviated codes
- LLMs already know standard event names
- Minimizes hallucinations over custom mappings
- Familiar to all developers for debugging

### HTML/Markdown Minification?
**Decision: No.** 
- LLMs handle whitespace fine; token cost is minimal
- Humans need to verify LLM output occasionally
- Browsers ignore whitespace anyway

### PWA Support?
**Decision: Yes, as optional enhancement (future).**
- Aligns with offline-first philosophy
- Service worker is pure JS, no build step
- Add `data-m-enhance="pwa"` to auto-register SW

### E2E Testing
**Decision: Opt-in via data-testid.**
- `data-testid="btn-save"` for Playwright/Cypress
- Prefix conventions: `btn-`, `inp-`, `msg-`, `lst-`
- Not required, but documented pattern

---

## Feature Roadmap (Prioritized)

### Tier 1: Critical (Every App Needs) ✅ COMPLETE
| # | Feature | Status | Notes |
|---|---------|--------|-------|
| 1 | `!` negation in `data-m-if` | ✅ | `data-m-if="!loading"` |
| 2 | `data-m-on` event binding | ✅ | Replace `onclick="window._fn()"` |
| 3 | Toast notifications | ✅ | `l.t(msg, type, duration)` |
| 4 | LocalStorage persistence | ✅ | `"persist":["key1","key2"]` in manifest |
| 5 | Loading spinner class | ✅ | `.spin` animation |

### Tier 2: High Value ✅ COMPLETE
| # | Feature | Status | Notes |
|---|---------|--------|-------|
| 6 | Dark mode toggle | ✅ | `data-m-enhance="darkmode"` |
| 7 | Grid utility classes | ✅ | `g`, `gc2`, `gc3`, `gc4`, `gc5`, `gc6` |
| 8 | Transitions class | ✅ | `.tr`, `.tr3`, `.tr5` |
| 9 | Truncation classes | ✅ | `.ell`, `.ln2`, `.ln3` |
| 10 | Empty state expressions | ✅ | `data-m-if="items.length==0"` |

### Tier 3: PWA & Offline
| # | Feature | Status | Notes |
|---|---------|--------|-------|
| 11 | Offline detection | ✅ | `data-m-if="_offline"` auto-bound |
| 12 | PWA manifest embedding | ⬜ | `<script type="application/manifest+json">` |
| 13 | Service worker auto-register | ⬜ | `data-m-enhance="pwa"` |

### Tier 4: Nice to Have
| # | Feature | Status | Notes |
|---|---------|--------|-------|
| 14 | Debounced inputs | ⬜ | `data-m-debounce="300"` |
| 15 | Computed state | ⬜ | Derived values auto-update |
| 16 | Image lazy loading | ⬜ | `data-m-enhance="lazy"` |
| 17 | Pagination pattern | ⬜ | `data-m-enhance="paginate"` |
| 18 | Infinite scroll | ⬜ | `data-m-enhance="infinite"` |
| 19 | Multi-step forms | ⬜ | `data-m-enhance="wizard"` |
| 20 | Date formatting pipe | ⬜ | `data-m-bind="date|date:short"` |

### Tier 5: Server-Side Skills ✅ COMPLETE
| # | Feature | Status | Notes |
|---|---------|--------|-------|
| 21 | SSR support | 🚧 | `_drafts/SKILL-SSR.md` - file-based routing, state injection (archived) |
| 22 | REST API support | 🚧 | `_drafts/SKILL-API.md` - native Node.js http module (archived) |
| 23 | ESM package support | ✅ | Recommended packages (better-sqlite3, zod, etc.) |

### Tier 6: Future Consideration
| # | Feature | Status | Notes |
|---|---------|--------|-------|
| 24 | Hydration markers | ⬜ | Partial hydration optimization |
| 25 | Web components bridge | ⬜ | Use existing WC libraries |
| 26 | Analytics hook | ⬜ | `l.track(event, data)` |

---

## Implementation Log

### Session: 2026-02-17 (continued)

**v1.3.0 - Server-Side Skills**

Added full-stack capabilities with two new skills:

REST API (`_drafts/SKILL-API.md` - archived):
- ✅ Native Node.js http module (no Express/Fastify)
- ✅ Single-file `server.js` output
- ✅ Route pattern matching with params
- ✅ CORS, JSON parsing, validation patterns
- ✅ File-based JSON persistence examples
- ✅ Recommended ESM packages (better-sqlite3, zod, jose, etc.)

SSR (`_drafts/SKILL-SSR.md` - archived):
- ✅ File-based routing (each HTML file = route)
- ✅ Selective SSR (only pages with handlers get state injection)
- ✅ Mixed page types (static, static+client, SSR, SSR+hydration)
- ✅ State injection into LLasM manifest
- ✅ SEO meta tag injection patterns

Documentation:
- ✅ `_drafts/api-patterns.md` - detailed API patterns (archived)
- ✅ `_drafts/ssr-patterns.md` - detailed SSR patterns (archived)
- ✅ Updated `AGENTS.md` with all three skills
- ✅ Updated `README.md` with server-side capabilities
- ✅ Added server section to docs site

Examples:
- ✅ `docs/examples/api-basic.js` - in-memory CRUD
- ✅ `docs/examples/api-with-db.js` - file persistence
- ✅ `docs/examples/ssr-basic.js` - file-based routing demo
- ✅ `docs/examples/ssr-with-api.js` - combined SSR + API

Philosophy clarification:
- "No build, not no packages" - ESM packages allowed
- Framework-free (no Express/Fastify) but not dependency-free
- `npm install` → `node server.js` is valid (no build step between)

---

### Session: 2026-02-17

**v1.2.1 - Skills Ecosystem Migration**

Migrated from custom npx installer to the [skills.sh](https://skills.sh) ecosystem:
- ✅ Updated README with `npx skills add walkingriver/llasm` installation
- ✅ Removed custom `bin/install.js` installer
- ✅ Updated package.json to align with skills format
- ✅ Added `AGENTS.md` for agent discovery
- ✅ Updated SKILL.md frontmatter with version/homepage/repository

**v1.2.0 Released**

Features implemented:
- ✅ `data-m-on` event binding (replaces window._ pattern)
- ✅ Toast notifications (`l.t(msg, type, duration)`)
- ✅ LocalStorage persistence (`persist` array in manifest)
- ✅ Dark mode toggle (`data-m-enhance="darkmode"`)
- ✅ Conditional expressions (`data-m-if="items.length==0"`, `!loading`)
- ✅ Grid utility classes (`g gc2 gc3 gc4 gc5 gc6 gr2 gr3`)
- ✅ Animation classes (`spin pulse fade`)
- ✅ Transition classes (`tr tr3 tr5`)
- ✅ Truncation classes (`ell ln2 ln3`)
- ✅ Offline detection (`_offline` built-in state)
- ✅ Nested state access (`data-m-bind="user.name"`)

Documentation updated:
- ✅ README.md
- ✅ SKILL.md
- ✅ references/runtime-api.md
- ✅ references/utility-classes.md
- ✅ references/enhancement-rules.md
- ✅ references/manifest-schema.md

Examples updated:
- ✅ features-demo.html (new - showcases all v1.2 features)
- ✅ tour-of-heroes.html (uses data-m-on, toast, persistence)
- ✅ todo-app.html (uses data-m-on, persistence, dark mode)

**Final size:** ~7.5KB gzipped (within 9KB budget)

---

## Size Budget

| Component | Est. Size |
|-----------|-----------|
| Core runtime | ~4KB |
| Utility CSS | ~2.8KB |
| Enhancements | ~0.7KB |
| **Total** | ~7.5KB |
| **Budget** | 9KB |
| **Remaining** | ~1.5KB |

Each new feature must justify its bytes.
