# Enhancement Rules

All behavior is applied via `data-m-enhance="flag1 flag2"` on native HTML elements.

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
