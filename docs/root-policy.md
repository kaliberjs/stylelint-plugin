# Root policy

Enforces valid property combinations at the root level of CSS rules. Currently, this rule focuses on stacking context validity.

## Valid stacking context

When `z-index` is used at the root level, it must create a proper non-invasive stacking context. This means:

1. `z-index` must be `0` (to avoid interfering with surrounding layout)
2. `position: relative` must also be present (required for `z-index` to take effect)

If you need a non-zero `z-index`, set it in a nested selector within another root rule instead.

## Examples

Examples of *correct* code:

```css
.component {
  position: relative;
  z-index: 0;
}
```

```css
.component {
  position: relative;
  z-index: 0;
}

.someParent {
  & > .component {
    z-index: 5;
  }
}
```

Examples of *incorrect* code:

```css
/* z-index without position: relative */
.component {
  z-index: 0;
}
```

```css
/* z-index is not 0 at root level */
.component {
  position: relative;
  z-index: 5;
}
```
