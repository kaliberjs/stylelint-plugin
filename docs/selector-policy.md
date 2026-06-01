# Selector policy

Enforces structural rules for CSS selectors to keep stylesheets maintainable and predictable. These rules prevent complex selector chains that make CSS hard to reason about and refactor.

## Rules

- [Only direct child selectors](#only-direct-child-selectors)
- [No double nesting](#no-double-nesting)
- [No child selectors at root](#no-child-selectors-at-root)
- [No double child selectors in nested](#no-double-child-selectors-in-nested)
- [No tag selectors](#no-tag-selectors)
- [No rules inside @media](#no-rules-inside-media)

## Only direct child selectors

Only the direct child combinator (`>`) is allowed. Descendant (space), sibling (`~`), and adjacent sibling (`+`) combinators are forbidden — with one exception: `*:checked +` is allowed for checkbox/radio hack patterns.

This keeps selectors shallow and predictable. If you need to select a deeper descendant, restructure your CSS.

### Examples

Examples of *correct* code:

```css
.component {
  & > .child {
    margin: 0;
  }
}
```

```css
/* checkbox hack pattern is allowed */
*:checked + .label {
  color: blue;
}
```

Examples of *incorrect* code:

```css
.component {
  /* descendant selector — too broad */
  & .deepChild {
    margin: 0;
  }
}
```

```css
.component {
  /* general sibling — unpredictable */
  & ~ .sibling {
    margin: 0;
  }
}
```

## No double nesting

Nesting is only allowed one level deep. Double-nested rules must be restructured into separate root rules.

### Examples

Examples of *correct* code:

```css
.component {
  & > .child {
    margin: 0;
  }
}
```

Examples of *incorrect* code:

```css
.component {
  & > .child {
    & > .grandchild {
      margin: 0;
    }
  }
}
```

## No child selectors at root

Root-level rules must not include child combinators. Write child selectors using nesting instead.

### Examples

Examples of *correct* code:

```css
.component {
  & > .child {
    margin: 0;
  }
}
```

Examples of *incorrect* code:

```css
.component > .child {
  margin: 0;
}
```

## No double child selectors in nested

A nested selector may only select one level of children. Selecting the child of a child requires a separate root rule.

### Examples

Examples of *correct* code:

```css
.component {
  & > .child {
    margin: 0;
  }
}
```

Examples of *incorrect* code:

```css
.component {
  & > .child > .grandchild {
    margin: 0;
  }
}
```

## No tag selectors

Tag selectors (`div`, `span`, `p`, etc.) are not allowed outside of `reset.css` and `index.css`. Give elements a class and select on that instead.

The exception is `svg` — SVG tag selectors are allowed for styling SVG internals.

### Examples

Examples of *correct* code:

```css
.component {
  & > .title {
    font-size: 18px;
  }
}
```

Examples of *incorrect* code:

```css
.component {
  & > p {
    font-size: 18px;
  }
}
```

## No rules inside @media

`@media` queries should be placed *inside* rules, not the other way around. This keeps the selector structure as the primary organization.

### Examples

Examples of *correct* code:

```css
.component {
  display: flex;

  @media (max-width: 600px) {
    display: block;
  }
}
```

Examples of *incorrect* code:

```css
@media (max-width: 600px) {
  .component {
    display: block;
  }
}
```
