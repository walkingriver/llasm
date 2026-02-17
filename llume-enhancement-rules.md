# Enhancement Rules — Exactly One Way

All rich behavior is applied via a single attribute on native HTML elements:

data-m-enhance="flag1 flag2 flag3…"

Allowed flags (hard-coded in runtime, v1):

- primary / secondary
- ripple
- disabled
- autofocus
- validate
- filterable single
- filterable multi
- combobox → upgrades <input> or <select>
- modal → upgrades <dialog> or <div>
- tabs → upgrades <div> containing <button> children
- accordion
- disclosure
- tooltip
- date
- progress

The runtime detects the flag combination and upgrades the element in-place (internal custom element, light DOM trigger, Shadow DOM only for popups when needed).

Never emit m- tags. Never define components. Never use class attributes for styling or behavior.
