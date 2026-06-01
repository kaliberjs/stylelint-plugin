# Index

The `index.css` file is for global tag-based styling and font imports. Class selectors are not allowed — use tag selectors instead or move class-based styles to component files.

This rule also controls what `@import` and `@kaliber-scoped` can do inside `index.css`:
- `@import` is only allowed for fonts
- `@kaliber-scoped` is only allowed for custom elements (e.g. `my-element`)

## Examples

Examples of *correct* code:

`index.css`:
```css
body {
  margin: 0;
  font-family: sans-serif;
}

a {
  color: inherit;
}

@import url('https://fonts.googleapis.com/css2?family=Inter');

@kaliber-scoped my-component;
```

Examples of *incorrect* code:

`index.css`:
```css
/* class selectors are not allowed in index.css */
.component {
  color: red;
}
```

`index.css`:
```css
/* only font imports are allowed */
@import './reset.css';
```
