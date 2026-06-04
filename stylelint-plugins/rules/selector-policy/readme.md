# Selector policy

Enforces structural rules for CSS selectors to keep stylesheets maintainable and predictable. These rules prevent complex selector chains that make CSS hard to reason about and refactor.

Our main concern is that selectors overreach and accidentally change components that are nested. Another big concern is that, by using deep selectors, big sections of html are tied together with CSS preventing you to grab a part and extract it into a separate component.

> Often, at the start of development, you write a bunch of tags and CSS to get a certain visual effect or appearance. When you are satisfied with what's on the screen you go back to your code and try to make it more readable, remove duplication and perform cleanup. This often involves grabbing sections of your code and extract it into components.

- [Direct child selectors](#direct-child-selectors)
- [No tag selectors](#no-tag-selectors)
- [No selectors in media queries](#no-selectors-in-media-queries)
- [Context](#context)
- [SVG](#svg)
- [Checked sibling](#checked-sibling)

## Direct child selectors

Only the direct child combinator (`>`) is allowed. Descendant (space), sibling (`~`), and adjacent sibling (`+`) combinators are forbidden — with one exception: `*:checked +` is allowed for checkbox/radio hack patterns.

This keeps selectors shallow and predictable. If you need to select a deeper descendant, restructure your CSS.

### Examples

Examples of *correct* code for this rule:

```css
.component {
  & > .child {
    margin: 0;
  }
}
```
```css
.good {
  &.test {
    ...
  }
}
```
```css
.good {
  &.test1 {
    & > .test2 {
      ...
    }
  }
}
```
```css
.good {
  & > *:not(:first-child) {
    ...
  }
}
```
```css
.good {
  & > .test {
    &:not(:last-child) {
      ...
    }
  }
}
```

Examples of *incorrect* code for this rule:

```css
.component {
  /* descendant selector — too broad */
  & .deepChild {
    margin: 0;
  }
}
```
```css
.bad > .test {
  ...
}
```
```css
.bad {
  & > .one > .two {
    ...
  }
}
```
```css
.bad {
  & > .test::after {

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
```css
.bad + .test {
  ...
}
```

## No tag selectors

Tag selectors (`div`, `span`, `p`, etc.) are not allowed outside of `reset.css` and `index.css`. Give elements a class and select on that instead.

We do not allow tag selectors because they are fragile. In most cases where the tag changed it required an extra test cycle to discover the developer forgot to change the CSS selector.

Using a tag selector in a component boundary is especially fragile as you cross the black-box boundary.

Having tag selectors on the root level is extremely problematic, what happens if you have a `div` selector in multiple CSS files?

The exception is `svg` — SVG tag selectors are allowed for styling SVG internals (see [SVG](#svg)).

### Examples

Examples of *correct* code for this rule:

```css
.component {
  & > .title {
    font-size: 18px;
  }
}
```

Examples of *incorrect* code for this rule:

```css
div {
  ...
}
```
```css
.component {
  & > p {
    font-size: 18px;
  }
}
```

## No selectors in media queries

`@media` queries should be placed *inside* rules, not the other way around. This keeps the selector structure as the primary organization.

This policy pushes media queries to the leaves of the CSS tree, making sure it only operates on properties.

As an added benefit this keeps the properties that change close together.

### Examples

Examples of *correct* code for this rule:

```css
.component {
  display: flex;

  @media (max-width: 600px) {
    display: block;
  }
}
```
```css
.good {
  & > * {
    width: 5px;

    @media x {
      width: 10px;
    }
  }
}
```

Examples of *incorrect* code for this rule:

```css
@media (max-width: 600px) {
  .component {
    display: block;
  }
}
```
```css
.bad {
  & > * {
    width: 5px;
  }

  @media x {
    & > * {
      width: 10px;
    }
  }
}
```

## Context

In some cases we want to apply a set of styles based on the context of an element. For that specific use case we introduced a data attribute selector that allows for non-direct child selectors.

For this to work we require the data attribute to start with the name `data-context-`.

### Examples

Examples of *correct* code for this rule:

```css
[data-context-scrolldir='down'] {
  & .good {
    color: red;
  }
}
```
```css
[data-context-scrolldir='down'] .good {
  color: red;
}
```

Examples of *incorrect* code for this rule:

```css
[data-context-scrolldir='down'] + .bad {
  color: red;
}
```

## SVG

The direct child policy and no tags policy do not apply to most svg elements.

### Examples

Examples of *correct* code for this rule:

```css
.abc {
  & > svg {
    & path {
      width: 10px;
    }
  }
}
```

Examples of *incorrect* code for this rule:

```css {
  & path {
    width: 10px;
  }
}
```

### Common refactorings

Before:
```css
.abc {
  & > svg {
    ...
  }
}
```

After:
```css
.abc {
  & > .icon {
    ...
  }
}
```

## Checked sibling

In some case the state comes from an `input` element, it would be awesome if you were able to do something like this:

```css
.myInput {
  &:checked > .abc {
    ...
  }
}
```

`input` elements however can't have children. To solve this use case we allow the following pattern to be used:

```css
*:checked + .abc {
  ...
}
```

This allows you to style an element based on the `:checked` property of its direct sibling. The rules are very strict and only this version (`*:checked + `) is allowed. Reason for this is that it prevents you from creating tangles and overreaching, which in turn makes component less portable.

### Examples

Examples of *correct* code for this rule:

```css
.abc {
  color: green;
}

*:checked + .abc {
  color: red;
}
```

Examples of *incorrect* code for this rule:

```css
.abc {
  color: green;
}

.other:checked ~ .abc {
  color: red;
}
```

### Common refactorings

Before:
```css
.other:checked ~ .abc {
  ...
}
```

After:
```css
*:checked + .abc {
  ...
}
```
