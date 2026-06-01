# Layout related properties

Layout properties — margin, position, width, height, z-index, flex/grid child properties — control how an element is positioned within its parent. This rule enforces a strict separation between a component's own styling (root rules) and how it positions its children (nested rules).

**Root rules** define what a component looks like internally. They should not contain layout properties because the component doesn't know how it will be positioned — that's the parent's job.

**Nested rules** (child selectors) define how children are positioned within a root rule. They should *only* contain layout properties. Non-layout properties in nested selectors usually mean the CSS should be restructured into its own root rule.

## Layout related properties

The full list of layout-related properties and their exact values is defined in [layout-related-properties/index.js](../stylelint-plugins/rules/layout-related-properties/index.js) (`layoutRelatedProps`). Flex/grid child properties are defined in [css.js](../stylelint-plugins/machinery/css.js).

### Exceptions

- `position: relative` and `overflow` are safe in both root and nested rules
- `display: none` is allowed everywhere
- **Intrinsic sizing** — `width`/`height` with one of the [intrinsic units](../stylelint-plugins/rules/layout-related-properties/index.js) and `!important` is treated as an intrinsic value and allowed in root rules
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
