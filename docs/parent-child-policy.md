# Parent-child policy

Enforces that certain CSS properties in child selectors are only used when the parent (root rule) provides the required context. This prevents common bugs where, for example, `flex-grow` is used without the parent having `display: flex`.

## Rules

- [Stacking context required for z-index](#stacking-context-required-for-z-index)
- [Relative parent required for absolute positioning](#relative-parent-required-for-absolute-positioning)
- [Display flex required for flex child properties](#display-flex-required-for-flex-child-properties)
- [Display grid required for grid child properties](#display-grid-required-for-grid-child-properties)
- [Pointer events requires parent to disable them](#pointer-events-requires-parent-to-disable-them)
- [Position static requires relative parent](#position-static-requires-relative-parent)
- [layoutClassName must be a direct child](#layoutclassname-must-be-a-direct-child)

## Stacking context required for z-index

When `z-index` is used in a nested selector, the containing root rule must create a stacking context with `position: relative` and `z-index: 0`.

### Examples

Examples of *correct* code:

```css
.component {
  position: relative;
  z-index: 0;

  & > .overlay {
    z-index: 1;
  }
}
```

Examples of *incorrect* code:

```css
.component {
  & > .overlay {
    z-index: 1; /* parent has no stacking context */
  }
}
```

## Relative parent required for absolute positioning

`position: absolute` in a nested selector requires the containing root rule to have `position: relative`.

### Examples

Examples of *correct* code:

```css
.component {
  position: relative;

  & > .badge {
    position: absolute;
    top: 0;
    right: 0;
  }
}
```

Examples of *incorrect* code:

```css
.component {
  & > .badge {
    position: absolute; /* parent is not position: relative */
  }
}
```

## Display flex required for flex child properties

Flex child properties (`flex`, `flex-grow`, `flex-shrink`, `flex-basis`, `order`) can only be used when the containing root rule has `display: flex`. If a media query overrides `display: flex`, use `unset` for the flex property.

### Examples

Examples of *correct* code:

```css
.component {
  display: flex;

  & > .item {
    flex: 1;
  }
}
```

Examples of *incorrect* code:

```css
.component {
  & > .item {
    flex: 1; /* parent has no display: flex */
  }
}
```

## Display grid required for grid child properties

Grid child properties (`grid-column`, `grid-row`, `grid-area`, etc.) can only be used when the containing root rule has `display: grid` or `display: inline-grid`.

## Pointer events requires parent to disable them

`pointer-events: auto` in a child only makes sense when the parent has `pointer-events: none`. This pattern is used to disable interaction on a container while re-enabling it on specific children.

### Examples

Examples of *correct* code:

```css
.component {
  pointer-events: none;

  & > .clickable {
    pointer-events: auto;
  }
}
```

Examples of *incorrect* code:

```css
.component {
  & > .clickable {
    pointer-events: auto; /* parent doesn't disable pointer events */
  }
}
```

## Position static requires relative parent

`position: static` in a child selector is only meaningful as a reset when the parent is `position: relative`.

## layoutClassName must be a direct child

Classes ending with the `Layout` suffix (layout class names) can only be targeted by a parent selector using the direct child combinator. Only layout-related properties may be used within layoutClassName rules.
