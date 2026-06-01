# Layout related properties

Layout properties — margin, position, width, height, z-index, flex/grid child properties — control how an element is positioned within its parent. This rule enforces a strict separation between a component's own styling (root rules) and how it positions its children (nested rules).

**Root rules** define what a component looks like internally. They should not contain layout properties because the component doesn't know how it will be positioned — that's the parent's job.

**Nested rules** (child selectors) define how children are positioned within a root rule. They should *only* contain layout properties. Non-layout properties in nested selectors usually mean the CSS should be restructured into its own root rule.

## Layout related properties

These properties are considered layout-related and may only appear in nested selectors:

- `z-index`
- `width`, `height`, `max-width`, `min-width`, `max-height`, `min-height`
- `position: absolute`, `position: fixed`
- `top`, `right`, `bottom`, `left`, `inset`
- `margin`, `margin-top`, `margin-right`, `margin-bottom`, `margin-left`
- `margin-inline`, `margin-inline-start`, `margin-inline-end`
- `margin-block`, `margin-block-start`, `margin-block-end`
- `justify-self`, `align-self`, `place-self`
- Flex child properties (`flex`, `flex-grow`, `flex-shrink`, `flex-basis`, `order`)
- Grid child properties (`grid-column`, `grid-row`, `grid-area`, etc.)

### Exceptions

- `position: relative` and `overflow` are safe in both root and nested rules
- `display: none` is allowed everywhere
- **Intrinsic sizing** — `width`/`height` with a unit like `px`, `em`, `rem`, `vw`, `vh`, `ch` and `!important` is treated as an intrinsic value and allowed in root rules
- **Ratio hack** — `height: 0` with a percentage `padding-bottom`/`padding-top` is allowed

## Examples

Examples of *correct* code for this rule:

```css
.component {
  display: flex;
  color: #333;

  & > .child {
    margin-left: 16px;
    flex: 1;
  }
}
```

```css
.component {
  position: relative; /* allowed in root */
  overflow: hidden;   /* allowed in root */
  width: 300px !important; /* intrinsic sizing */
}
```

Examples of *incorrect* code for this rule:

```css
/* margin is a layout property — belongs in a nested selector */
.component {
  margin-left: 16px;
}
```

```css
.component {
  & > .child {
    /* color is not layout-related — should be in a root rule */
    color: red;
  }
}
```

## Escape hatch

If a third-party library forces layout properties at the root level, rename the selector to `_rootXyz` or `component_rootXyz` to bypass this check.
