# Index

The `index.css` file is for global tag-based styling using tag selectors. Class selectors are not allowed — use tag selectors instead or move class-based styles to component files.

Fonts should be self-hosted using `@font-face` declarations — either inline in `index.css` or in a separate file in `cssGlobal/`.

## Examples

Examples of *correct* code:

`index.css`:
```css
@font-face {
  font-family: 'Inter';
  src: url('/fonts/Inter-Regular.woff2') format('woff2');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

html {
  font-size: 100%;
}

body {
  font-family: var(--font-family-base);
  line-height: 1.7;
}
```

Examples of *incorrect* code:

`index.css`:
```css
/* class selectors are not allowed in index.css */
.component {
  color: red;
}
```
