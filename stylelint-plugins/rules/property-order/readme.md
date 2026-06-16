# Property order

Declarations within a rule must follow a fixed property order, grouped by concern (interaction,
positioning, layout, box-model, typography, appearance, svg-presentation, transition). The order is
copied from [`stylelint-config-clean-order`](https://www.npmjs.com/package/stylelint-config-clean-order)
into [`property-order.js`](./property-order.js) — no external dependency is pulled in.

This rule is **fixable**: run stylelint with `--fix` to reorder declarations automatically.

## What it does and doesn't do

- **Known props are sorted** relative to each other into the canonical order.
- **Unknown props are left alone** — custom properties (`--x`), vendor-prefixed props, and anything not
  in the list are never reported, and on fix they keep their original slot (known props are sorted
  around them).
- **No blank lines between groups.** Unlike the upstream config, this rule never inserts empty lines;
  declarations stay compact. Empty-line behaviour is governed by `declaration-empty-line-before`.

## Examples

Examples of *correct* code:

```css
a {
  display: block;
  color: red;
}
```

```css
a {
  display: block;
  --custom: 1;
  color: red;
}
```

Examples of *incorrect* code:

```css
/* `display` (layout) must come before `color` (typography) */
a {
  color: red;
  display: block;
}
```
