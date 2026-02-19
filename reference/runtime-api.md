# Runtime API

The LLasM runtime is exposed as `l` via ESM import.

## Philosophy

- **Terse by Default** - Single-letter API: `l.h()`, `l.u()`, `l.t()`
- **One Way** - Single canonical approach per concept
- **Browser-Native** - Only browser APIs. No external dependencies

## Initialization

```javascript
import { l } from "./llasm.js";

// Register handlers (call once)
l.h({
  f1: (e, s, L, el) => { /* handler */ },
  f2: (e, s, L, el) => { /* handler */ }
});
```

## Handler Signature

All handlers receive four arguments:

```javascript
(event, state, L, element) => {
  // event: DOM event object
  // state: current state snapshot
  // L: runtime API
  // element: the DOM element that triggered the event
}
```

## API Methods

### l.h(handlers)
Register event handlers. Call once on page load.

```javascript
l.h({
  save: (e, s, L) => { L.u({ saved: true }); L.t('Saved!', 'ok'); }
});
```

### l.u(patch)
Update state with partial object. Triggers reactive DOM updates.

```javascript
l.u({ count: 5, name: "Alice" });
```

### l.r(locale)
Switch i18n locale.

```javascript
l.r("es"); // Switch to Spanish
```

### l.s()
Get serialized state snapshot (deep copy).

```javascript
const currentState = l.s();
console.log(currentState.count);
```

### l.q(selector)
Query single element (shorthand for querySelector).

```javascript
const btn = l.q("#submit");
```

### l.qa(selector)
Query all elements (shorthand for querySelectorAll).

```javascript
const items = l.qa(".item");
```

### l.vf(form)
Validate form element. Returns validation result.

```javascript
const result = l.vf(document.forms[0]);
// result = { v: true/false, e: [{n: "email", m: "Invalid"}] }
```

### l.f(url, opts, retries)
Fetch with automatic retry (default 3 attempts).

```javascript
const data = await l.f("/api/items", { method: "GET" });
```

### l.p()
Get route parameters from parameterized routes like `/hero/:id`.

```javascript
// URL: #/hero/123
const params = l.p(); // { id: "123" }
```

### l.nav(hash)
Navigate to a hash route programmatically.

```javascript
l.nav("/detail/123");
```

### l.t(message, type, duration)
Show a toast notification.

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| message | string | required | Toast message |
| type | string | `'info'` | `'ok'`, `'err'`, or `'info'` |
| duration | number | `3000` | Auto-hide duration in ms |

```javascript
l.t('Saved!', 'ok');           // success toast
l.t('Error occurred', 'err');  // error toast
l.t('Loading...', 'info', 5000); // info toast, 5s
```

## Event Binding

### Preferred: data-m-on (HTML attribute)

Bind events directly in HTML:

```html
<button data-m-on="click:save">Save</button>
<input data-m-on="input:typing,focus:focused">
<form data-m-on="submit:send">
```

Multiple events use comma separation:
```html
<input data-m-on="input:onChange,blur:validate">
```

### Legacy: Manifest binding

Events can also be bound via the `e` key in manifest elements:

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
- `e` = keyup
- `m` = mouseenter
- `o` = mouseleave

## State Persistence

Mark state keys for localStorage persistence in manifest:

```json
{
  "v": 1,
  "r": { "s": { "items": [], "counter": 0 } },
  "persist": ["items", "counter"]
}
```

Persisted keys automatically:
- Load from localStorage on mount
- Save to localStorage on every state change

## Built-in State

The runtime provides automatic state:

| Key | Type | Description |
|-----|------|-------------|
| `_offline` | boolean | `true` when browser is offline |

```html
<span data-m-if="_offline">You're offline</span>
<span data-m-if="!_offline">Connected</span>
```

## Conditional Rendering

### data-m-if

Show/hide elements based on state:

```html
<!-- Simple truthy -->
<div data-m-if="user">Logged in</div>

<!-- Negation -->
<div data-m-if="!loading">Ready</div>

<!-- Array length -->
<div data-m-if="items.length==0">Empty</div>
<div data-m-if="items.length>0">Has items</div>

<!-- Equality -->
<div data-m-if="status==active">Active</div>
<div data-m-if="role!=admin">Not admin</div>
```

### data-m-class

Conditional CSS classes:

```html
<li data-m-class="active:isSelected,disabled:isLocked">
```

## Data Binding

### data-m-bind

Bind state to elements:

```html
<!-- Text content -->
<span data-m-bind="username"></span>

<!-- With pipe transform -->
<span data-m-bind="name|upper"></span>

<!-- Nested state -->
<span data-m-bind="user.name"></span>

<!-- Input two-way binding -->
<input data-m-bind="searchTerm">

<!-- Array rendering -->
<ul data-m-bind="items" data-m-tpl="tpl" data-m-key="id"></ul>
```

Pipes: `upper`, `lower`, `title`, `trim`

## Template Rendering

```html
<ul data-m-bind="items" data-m-tpl="item-tpl" data-m-key="id"></ul>
<template id="item-tpl">
  <li data-m-on="click:select">
    <span data-m-f="name"></span>
  </li>
</template>
```

`data-m-f` binds item fields within templates.
