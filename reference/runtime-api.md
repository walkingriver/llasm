# Runtime API

The LLuMe runtime is exposed as `l` via ESM import.

## Initialization

```javascript
import { l } from "./llume.js";

// Register handlers (call once)
l.h({
  f1: (e, s, L) => { /* handler */ },
  f2: (e, s, L) => { /* handler */ }
});
```

## Handler Signature

All handlers receive three arguments:

```javascript
(event, state, L) => {
  // event: DOM event object
  // state: current state snapshot
  // L: runtime API
}
```

## API Methods

### l.h(handlers)
Register event handlers. Call once on page load.

```javascript
l.h({
  f1: (e, s, L) => { L.u({ count: s.count + 1 }); }
});
```

### L.u(patch)
Update state with partial object. Triggers reactive DOM updates.

```javascript
L.u({ count: 5, name: "Alice" });
```

### L.r(locale)
Switch i18n locale.

```javascript
L.r("es"); // Switch to Spanish
```

### L.s()
Get serialized state snapshot (deep copy).

```javascript
const currentState = L.s();
console.log(currentState.count);
```

### L.q(selector)
Query single element (shorthand for querySelector).

```javascript
const btn = L.q("#submit");
```

### L.qa(selector)
Query all elements (shorthand for querySelectorAll).

```javascript
const items = L.qa(".item");
```

### L.vf(form)
Validate form element. Returns validation result.

```javascript
const result = L.vf(document.forms[0]);
// result = { v: true/false, e: [{n: "email", m: "Invalid"}] }
```

### L.f(url, opts, retries)
Fetch with automatic retry (default 3 attempts).

```javascript
const data = await L.f("/api/items", { method: "GET" });
```

## Event Binding in Manifest

Events are bound via the `e` key in manifest elements:

```json
{
  "t": "button",
  "a": { "id": "btn" },
  "e": { "c": "f1" }
}
```

Event shorthand:
- `c` = click
- `i` = input
- `s` = submit
- `f` = focus
- `b` = blur
- `k` = keydown
