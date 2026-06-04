# Index

The `index.css` file is for global tag-based styling using tag selectors. Class selectors are not allowed — use tag selectors or `:global` class selectors instead, or move class-based styles to component files.

Fonts should be self-hosted using `@font-face` declarations — either inline in `index.css`, in a dedicated `fonts.css`, or in a file in `cssGlobal/`.

## Examples

Examples of *correct* code for this rule:

`fonts.css`:
```css
@font-face {
  font-family: 'Inter';
  src: url('/fonts/Inter-Regular.woff2') format('woff2');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}
```

`index.css`:
```css
html {
  box-sizing: border-box;
  font-size: 100%;
}

body {
  color: var(--color-gray-900);
  font-family: var(--font-family-base);
  font-size: var(--font-size-md);
  line-height: 1.7;
}
```

Examples of *incorrect* code for this rule:

`index.css`:
```css
/* class selectors are not allowed in index.css */
.component {
  color: red;
}
```

## Common refactorings

Before:
```css
.external-library-item {
  ...
}
```

After:
```css
:global(.external-library-item) {
  ...
}
```
