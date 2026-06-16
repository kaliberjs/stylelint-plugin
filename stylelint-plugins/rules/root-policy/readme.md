# Root policy

Enforces valid property combinations at the root level of CSS rules. Currently, this rule focuses on stacking context validity.

- [Stacking context](#stacking-context)

## Stacking context

When `z-index` is used at the root level, it must create a proper non-invasive stacking context. This means:

1. `z-index` must be `0` (to avoid interfering with surrounding layout)
2. `position: relative` must also be present (required for `z-index` to take effect)

We choose this combination because it's 'safe' (it does not affect anything outside of the element).

If you need a non-zero `z-index`, set it in a nested selector within another root rule instead.

### Examples

Examples of *correct* code for this rule:

```css
.parent {
  z-index: 0;
  position: relative;
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

Examples of *incorrect* code for this rule:

```css
/* z-index without position: relative */
.parent {
  z-index: 1;
}
```

```css
/* z-index is not 0 at root level */
.component {
  position: relative;
  z-index: 5;
}
```

## Common refactorings

Before:
```css
.abc {
  z-index: 1;
}
```

After:
```css
.parentOfAbc {
  z-index: 0;
  position: relative;

  & > .abc {
    z-index: 1;
  }
}
```

---

Before:
```css
.abc {
  z-index: 1;
  position: relative;

  &::after {
    z-index: -1;
  }
}
```

After:
```css
.parentOfAbc {
  z-index: 0;
  position: absolute;

  & > .abc {
    z-index: 1;
  }
}

.abc {
  z-index: 0;
  position: relative;

  &::after {
    z-index: -1;
  }
}
```
