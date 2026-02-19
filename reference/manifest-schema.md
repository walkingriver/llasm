# Manifest Schema

The manifest is embedded JSON in `<script type="application/llasm+json" id="manifest">`.

## Full Structure

```json
{
  "v": 1,
  "r": {
    "t": "div",
    "a": {"id": "app"},
    "c": [...],
    "s": {"count": 0, "items": []}
  },
  "persist": ["items"],
  "l": {
    "en": {"title": "Hello", "btn": "Click"},
    "es": {"title": "Hola", "btn": "Clic"}
  },
  "t": {
    "--m-p": "#0066ff",
    "--m-s": "#6c757d",
    "--m-bg": "#ffffff"
  }
}
```

## Top-Level Keys

| Key | Type | Required | Description |
|-----|------|----------|-------------|
| `v` | number | Yes | Schema version (always `1`) |
| `r` | object | No | Root element with initial state |
| `persist` | array | No | State keys to persist to localStorage |
| `l` | object | No | Locale strings by language code |
| `t` | object | No | CSS custom properties (theme) |

## State Persistence (Three-Tier Storage)

State keys can be persisted to different storage tiers:

### Object Syntax (Recommended)

```json
{
  "v": 1,
  "r": {"s": {"cart": [], "user": null, "temp": ""}},
  "persist": {"cart": "local", "user": "session"}
}
```

| Tier | Storage | Lifetime |
|------|---------|----------|
| `"session"` | sessionStorage | Tab lifetime |
| `"local"` | localStorage | Browser lifetime |
| `"server"` | API fetch | Permanent (future) |

### Array Syntax (Legacy)

```json
{
  "v": 1,
  "r": {"s": {"items": [], "counter": 0}},
  "persist": ["items", "counter"]
}
```

Array syntax defaults all keys to localStorage.

### Behavior

- Listed keys are saved on every state change
- On page load, persisted values are restored
- Non-persisted keys (like `temp` above) reset to initial values

## Element Structure (recursive in `r`)

| Key | Type | Description |
|-----|------|-------------|
| `t` | string | Tag name (native HTML only) |
| `a` | object | Attributes |
| `c` | array | Children (nested elements) |
| `tx` | string | i18n key (without `@` prefix) |
| `s` | object | State object for this subtree |
| `e` | object | Event handlers: `{"c":"f1"}` = click→f1 |
| `b` | string | Bind to state key |

## Event Shorthand

| Key | Event |
|-----|-------|
| `c` | click |
| `i` | input |
| `s` | submit |
| `f` | focus |
| `b` | blur |
| `k` | keydown |
| `e` | keyup |
| `m` | mouseenter |
| `o` | mouseleave |

## Theme Variables

Standard variables the runtime recognizes. Set in manifest `t` section.

| Variable | Default | Purpose | Utility Classes |
|----------|---------|---------|-----------------|
| `--m-p` | `#0066ff` | Primary color | `c1`, `b1`, `bd1` |
| `--m-s` | `#6c757d` | Secondary color | `c2`, `b2`, `bd2` |
| `--m-ok` | `#28a745` | Success color | `c3`, `b3` |
| `--m-err` | `#dc3545` | Error color | `c4`, `b4` |
| `--m-bg` | `#ffffff` | Background | body default |
| `--m-fg` | `#212529` | Foreground/text | body default |

### Theme Examples

**Dark mode:**
```json
"t": {
  "--m-p": "#818cf8",
  "--m-s": "#64748b",
  "--m-bg": "#0f172a",
  "--m-fg": "#f1f5f9"
}
```

**Brand colors:**
```json
"t": {
  "--m-p": "#7c3aed",
  "--m-s": "#a78bfa"
}
```

**Warm theme:**
```json
"t": {
  "--m-p": "#ea580c",
  "--m-s": "#78716c",
  "--m-ok": "#16a34a",
  "--m-err": "#dc2626"
}
```

The LLM generates appropriate values based on human description:
- "Make it purple" → `"--m-p": "#7c3aed"`
- "Dark theme" → `"--m-bg": "#1a1a1a", "--m-fg": "#f5f5f5"`
- "Corporate blue" → `"--m-p": "#0066cc"`
