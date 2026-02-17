# Utility Classes

LLuMe includes ~80 utility classes for styling. Maximally terse, one way per concept.

## Layout

| Class | CSS |
|-------|-----|
| `f` | `display: flex` |
| `fc` | `display: flex; flex-direction: column` |
| `fw` | `display: flex; flex-wrap: wrap` |
| `fi` | `align-items: center` |
| `fj` | `justify-content: center` |
| `fb` | `justify-content: space-between` |
| `fa` | `justify-content: space-around` |
| `fe` | `justify-content: flex-end` |
| `fs` | `justify-content: flex-start` |
| `fg` | `flex-grow: 1` |

## Gap

| Class | Value |
|-------|-------|
| `g1` | 0.25rem |
| `g2` | 0.5rem |
| `g3` | 1rem |
| `g4` | 1.5rem |
| `g5` | 2rem |

## Padding

| Class | Value |
|-------|-------|
| `p1-p5` | 0.25rem - 2rem |
| `px1-px5` | padding-inline |
| `py1-py5` | padding-block |

## Margin

| Class | Value |
|-------|-------|
| `m1-m5` | 0.25rem - 2rem |
| `mx1-mx5` | margin-inline |
| `my1-my5` | margin-block |
| `ma` | margin: auto |
| `mxa` | margin-inline: auto |

## Width

| Class | Value |
|-------|-------|
| `wf` | 100% |
| `wh` | 50% |
| `wa` | auto |
| `w1-w9` | 10% - 90% |
| `xw1-xw5` | max-width: 400px - 1200px |

## Height

| Class | Value |
|-------|-------|
| `hf` | 100% |
| `hv` | 100vh |
| `ha` | auto |

## Typography

| Class | CSS |
|-------|-----|
| `t1-t7` | font-size: 0.75rem - 3rem |
| `tc` | text-align: center |
| `tr` | text-align: right |
| `tl` | text-align: left |
| `tb` | font-weight: 700 |
| `tn` | font-weight: 400 |
| `ti` | font-style: italic |
| `tu` | text-transform: uppercase |
| `td` | text-decoration: underline |
| `tdn` | text-decoration: none |

## Colors

| Class | Value |
|-------|-------|
| `c1` | var(--m-p) primary |
| `c2` | var(--m-s) secondary |
| `c3` | var(--m-ok) success |
| `c4` | var(--m-err) error |
| `cw` | white |
| `cb` | black |
| `cg` | gray |

## Background

| Class | Value |
|-------|-------|
| `b1` | var(--m-p) primary |
| `b2` | var(--m-s) secondary |
| `b3` | var(--m-ok) success |
| `b4` | var(--m-err) error |
| `bw` | white |
| `bb` | black |
| `bg` | #f5f5f5 gray |
| `bt` | transparent |

## Border & Radius

| Class | CSS |
|-------|-----|
| `bd` | border: 1px solid currentColor |
| `bd1` | border: 1px solid primary |
| `bd2` | border: 1px solid secondary |
| `bdn` | border: none |
| `r` | border-radius: 4px |
| `r1` | border-radius: 2px |
| `r2` | border-radius: 8px |
| `r3` | border-radius: 12px |
| `rf` | border-radius: 9999px (pill) |

## Shadow

| Class | CSS |
|-------|-----|
| `sh` | standard shadow |
| `sh1` | subtle shadow |
| `sh2` | medium shadow |
| `sh3` | strong shadow |

## Opacity

| Class | Value |
|-------|-------|
| `o1-o9` | 0.1 - 0.9 |

## Display

| Class | CSS |
|-------|-----|
| `dn` | display: none |
| `db` | display: block |
| `di` | display: inline |
| `dib` | display: inline-block |

## Position

| Class | CSS |
|-------|-----|
| `rel` | position: relative |
| `abs` | position: absolute |
| `fix` | position: fixed |
| `stk` | position: sticky |
| `t0` | top: 0 |
| `r0` | right: 0 |
| `b0` | bottom: 0 |
| `l0` | left: 0 |
| `i0` | inset: 0 |

## Z-Index

| Class | Value |
|-------|-------|
| `z1` | 10 |
| `z2` | 100 |
| `z3` | 1000 |

## Overflow

| Class | CSS |
|-------|-----|
| `oh` | overflow: hidden |
| `oa` | overflow: auto |
| `os` | overflow: scroll |

## Cursor & Pointer

| Class | CSS |
|-------|-----|
| `cp` | cursor: pointer |
| `cn` | cursor: not-allowed |
| `pe` | pointer-events: none |
| `pa` | pointer-events: auto |
| `us` | user-select: none |

## Responsive (sm: prefix for <768px)

| Class | Effect |
|-------|--------|
| `sm:dn` | hide on mobile |
| `sm:db` | show on mobile |
| `sm:fc` | column on mobile |
| `sm:wf` | full width on mobile |

## Example

```html
<div class="f fc g3 p4 xw3 mxa">
  <h1 class="t6 tb c1 tc">Title</h1>
  <p class="t3 cg tc">Subtitle text</p>
  <div class="f g2 fw fj">
    <button class="b1 cw p2 px4 r cp">Primary</button>
    <button class="b2 cw p2 px4 r cp">Secondary</button>
  </div>
</div>
```
