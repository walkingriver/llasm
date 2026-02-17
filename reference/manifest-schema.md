# Manifest Schema

The manifest is embedded JSON in `<script type="application/llume+json" id="manifest">`.

## Full Structure

```json
{
  "v": 1,
  "r": {
    "t": "div",
    "a": {"id": "app"},
    "c": [...],
    "s": {"count": 0}
  },
  "l": {
    "en": {"@title": "Hello", "@btn": "Click"},
    "es": {"@title": "Hola", "@btn": "Clic"}
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
| `l` | object | No | Locale strings by language code |
| `t` | object | No | CSS custom properties (theme) |

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

Standard variables the runtime recognizes:

| Variable | Default | Purpose |
|----------|---------|---------|
| `--m-p` | `#0066ff` | Primary color |
| `--m-s` | `#6c757d` | Secondary color |
| `--m-bg` | `#ffffff` | Background |
| `--m-fg` | `#212529` | Foreground/text |
| `--m-err` | `#dc3545` | Error color |
| `--m-ok` | `#28a745` | Success color |
