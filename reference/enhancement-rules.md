# Enhancement Rules

All behavior is applied via `data-m-enhance="flag1 flag2"` on native HTML elements.

## Philosophy

- **CSS Before JS** - Use CSS-only solutions when possible (hover states, transitions)
- **Semantic Elements** - Use native HTML5 elements (button, dialog, form)
- **Progressive Enhancement** - Page works without JS, enhanced with JS
- **ARIA Automation** - Runtime adds ARIA attributes automatically

## Button Enhancements

### primary
Applies primary button styling with theme color.
```html
<button data-m-enhance="primary">Submit</button>
```

### secondary
Applies secondary button styling.
```html
<button data-m-enhance="secondary">Cancel</button>
```

### ripple
Adds Material-style ripple effect on click.
```html
<button data-m-enhance="primary ripple">Click Me</button>
```

### disabled
Disables element with proper ARIA.
```html
<button data-m-enhance="primary disabled">Unavailable</button>
```

## Form Enhancements

### validate
Triggers form validation on click.
```html
<button type="submit" data-m-enhance="primary validate">Submit</button>
```

### autofocus
Auto-focuses element on mount.
```html
<input data-m-enhance="autofocus" placeholder="Start typing">
```

### date
Enhances input as date picker.
```html
<input data-m-enhance="date">
```

## Widget Enhancements

### combobox / filterable
Upgrades a container with input + list to filterable dropdown.
```html
<div data-m-enhance="combobox">
  <input placeholder="Select...">
  <ul>
    <li data-m-opt>Option 1</li>
    <li data-m-opt>Option 2</li>
  </ul>
</div>
```

### modal
Upgrades dialog or div to modal with focus trap.
```html
<dialog data-m-enhance="modal" id="dlg">
  <h2>Modal Title</h2>
  <button onclick="document.getElementById('dlg')._mClose()">Close</button>
</dialog>
```

### tabs
Upgrades container to accessible tab interface.
```html
<div data-m-enhance="tabs">
  <button data-m-tab="t1">Tab 1</button>
  <button data-m-tab="t2">Tab 2</button>
  <div data-m-panel="t1">Content 1</div>
  <div data-m-panel="t2">Content 2</div>
</div>
```

### accordion
Upgrades container to accordion.
```html
<div data-m-enhance="accordion">
  <div data-m-acc>
    <div data-m-hd>Header 1</div>
    <div data-m-bd>Body 1</div>
  </div>
  <div data-m-acc>
    <div data-m-hd>Header 2</div>
    <div data-m-bd>Body 2</div>
  </div>
</div>
```

### disclosure
Toggleable expand/collapse.
```html
<div data-m-enhance="disclosure">
  <button>Show More</button>
  <div data-m-content>Hidden content here.</div>
</div>
```

### tooltip
Shows tooltip on hover/focus.
```html
<div data-m-enhance="tooltip">
  <button>Hover me</button>
  <span data-m-tip>Tooltip text</span>
</div>
```

### progress
Creates progress bar.
```html
<div data-m-enhance="progress" data-m-max="100" data-m-value="42"></div>
```

### toast
Creates toast notification container.
```html
<div data-m-enhance="toast"></div>
```
Usually not needed - runtime auto-creates toast container when `l.t()` is called.

### darkmode
Toggles dark mode on click and persists preference.
```html
<button data-m-enhance="darkmode">Toggle Dark Mode</button>
```
- Adds/removes `dark` class on `<body>`
- Persists to localStorage
- Loads saved preference on page load

## Event Binding

### data-m-on
Bind events directly in HTML (preferred over onclick):
```html
<!-- Single event -->
<button data-m-on="click:save">Save</button>

<!-- Multiple events -->
<input data-m-on="input:typing,blur:validate">

<!-- Form submit -->
<form data-m-on="submit:send">
```

Handlers receive `(event, state, L, element)`:
```javascript
l.h({
  save: (e, s, L, el) => {
    L.u({ saved: true });
    L.t('Saved!', 'ok');
  }
});
```

## Conditional Rendering

### data-m-if
Shows/hides element based on expressions.
```html
<!-- Simple truthy -->
<div data-m-if="user">Logged in</div>

<!-- Negation -->
<div data-m-if="!loading">Content loaded</div>

<!-- Array length checks -->
<div data-m-if="items.length==0">No items</div>
<div data-m-if="items.length>0">Has items</div>

<!-- Equality -->
<div data-m-if="status==active">Active</div>
<div data-m-if="role!=admin">Not admin</div>
```

### data-m-class
Adds CSS class conditionally.
```html
<!-- Simple truthy check -->
<li data-m-class="active:isSelected">Item</li>

<!-- Equality check -->
<li data-m-class="selected:currentId==itemId">Item</li>

<!-- Multiple rules -->
<li data-m-class="active:isActive,disabled:isDisabled">Item</li>
```

## Text Transforms (Pipes)

Use with `data-m-bind`:
```html
<span data-m-bind="name|upper"></span>  <!-- UPPERCASE -->
<span data-m-bind="name|lower"></span>  <!-- lowercase -->
<span data-m-bind="name|title"></span>  <!-- Title Case -->
<span data-m-bind="name|trim"></span>   <!-- trimmed -->
```

## Route Parameters

Use `:param` syntax in routes:
```html
<section data-m-route="/hero/:id">
  <span data-m-bind="id"></span>  <!-- Binds to route param -->
</section>
```

Access in handlers via `l.p()`:
```javascript
const params = l.p(); // { id: "123" }
```

## Built-in State

The runtime provides automatic state values:

| Key | Type | Description |
|-----|------|-------------|
| `_offline` | boolean | `true` when browser is offline |

```html
<span data-m-if="_offline">You're offline</span>
```

## LocalStorage Persistence

Mark state keys for automatic persistence:
```json
{
  "v": 1,
  "r": { "s": { "items": [], "theme": "light" } },
  "persist": ["items", "theme"]
}
```

## ARIA Automation

The runtime automatically adds appropriate ARIA attributes:

| Enhancement | Auto-added ARIA |
|-------------|-----------------|
| `modal` | `role="dialog"`, `aria-modal="true"` |
| `tabs` | `role="tablist/tab/tabpanel"`, `aria-selected` |
| `combobox` | `role="combobox/listbox/option"`, `aria-expanded` |
| `disclosure` | `aria-expanded` |
| `disabled` | `aria-disabled="true"` |
| `progress` | `role="progressbar"`, `aria-valuenow/min/max` |
| `toast` | `aria-live="polite"` |
