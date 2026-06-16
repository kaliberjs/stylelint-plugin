# Layout related properties

Layout properties — margin, position, width, height, z-index, flex/grid child properties — control how an element is positioned within its parent. This rule enforces a strict separation between a component's own styling (root rules) and how it positions its children (nested rules).

**Root rules** define what a component looks like internally. They should not contain layout properties because the component doesn't know how it will be positioned — that's the parent's job.

**Nested rules** (child selectors) define how children are positioned within a root rule. They should *only* contain layout properties. Non-layout properties in nested selectors usually mean the CSS should be restructured into its own root rule.

Concretely, the following should be refactored as shown:

```css
.container {
  color: red;
}

.child {
  margin: 10px;
  color: green;
}
```

```css
.container {
  color: red;
  padding: 10px;

  & > .child:not(:last-child) {
    margin-bottom: 10px;
  }
}

.child {
  color: green;
}
```

In the refactored code, the `.child` element can be reused in another context where spacing might be different.

Additionally, the following should be refactored as shown:

```css
.container {
  color: red;

  & > .child {
    padding: 10px;
    display: block;
  }
}
```

```css
.container {
  color: red;
}

.child {
  padding: 10px;
  display: block;
}
```

Before refactoring, the container might break the layout of the `.child` as it might have been configured to use `display: flex;`. It also assumes something about the sub-structure of `.child` by setting a padding.

## Exceptions

There are a few exceptions to this rule.

### Intrinsic size

Normally a parent determines the size (or available space) of a child element. There are however some cases where an element has a size of its own; an intrinsic size (an example could be an icon). You can use the following pattern set an intrinsic size: `{prop}: {size}{unit} !important`

```css
.component {
  width: 20px !important;
}
```

The `prop` must be one of: `width`, `height`, `max-width`, `min-width`, `max-height`, `min-height`

The `unit` must be one of: `px`, `em`, `rem`, `vw`, `vh`

### Ratio hack

When the `height` is set to `0` and the `padding-top` or `padding-bottom` is set to a percentage, the element maintains a fixed ratio. The parent will determine the width, but the component determines the height based on the given ratio.

```css
.component {
  height: 0;
  padding-bottom: calc((9 / 16) * 100%);
}
```

### Pseudo elements

Pseudo elements are always child elements, but since they only exist in the context of CSS they are not restricted to only layout related properties.

```css
.component {
  &::before {
    content: '';
    width: 10px;
    height: 10px;
    color: black;
  }
}
```

### Escape hatch

If a third-party library forces layout properties at the root level, rename the selector to `_rootXyz` or `component_rootXyz` to bypass this check.

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

```css
.good {
  position: relative;

  & > .test {
    width: 100%; height: 100%;
    position: absolute;
    top: 0; right: 0; bottom: 0; left: 0;
    margin: 0; margin-top: 0; margin-right: 0; margin-bottom: 0;margin-left: 0;
    margin-inline: 0; margin-inline-start: 0; margin-inline-end: 0;
    margin-block: 0; margin-block-start: 0; margin-block-end: 0;
    flex: 0; flex-grow: 0; flex-shrink: 0; flex-basis: 0;
    grid: 0; grid-area: 0; grid-column: 0; grid-row: 0;
    grid-column-start: 0; grid-column-end: 0; grid-row-start: 0; grid-row-end: 0;
    justify-self: 0; align-self: 0;
    order: 0;
  }
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

```css
.bad {
  width: 100%; height: 100%;
  position: absolute;
  top: 0; right: 0; bottom: 0; left: 0;
  margin: 0; margin-top: 0; margin-right: 0; margin-bottom: 0; margin-left: 0;
  margin-inline: 0; margin-inline-start: 0; margin-inline-end: 0;
  margin-block: 0; margin-block-start: 0; margin-block-end: 0;
  flex: 0; flex-grow: 0; flex-shrink: 0; flex-basis: 0;
  grid: 0; grid-area: 0; grid-column: 0; grid-row: 0;
  grid-column-start: 0; grid-column-end: 0; grid-row-start: 0; grid-row-end: 0;
  justify-self: 0; align-self: 0;
  order: 0;
  max-width: 0; min-width: 0; max-height: 0; min-height: 0;
}
```

## Common refactorings

Before:
```css
.abc {
  width: 100%;
}
```

After:
```css
.abcParent {
  & > .abc {
    width: 100%;
  }
}
```
