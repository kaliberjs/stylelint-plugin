# Index

The file named `index.css` has a special meaning. It is meant to set domain specific defaults for html tags.

The following applies to `index.css`:

- Only tag selectors or `:global` class selectors (no normal class selectors)

Fonts should be self-hosted using `@font-face` declarations — either inline in `index.css`, in a dedicated `fonts.css`, or in a file in `cssGlobal/`.

## Examples

Examples of *correct* code for this rule:

`fonts.css`
```css
@font-face {
  font-family: 'Inter';
  src: url('/fonts/Inter-Regular.woff2') format('woff2');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}
```

`index.css`
```css
html {
  box-sizing: border-box;
  overflow-y: scroll;
}

body {
  color: var(--color-gray-900);
  font-family: var(--font-family-base);
  font-size: var(--font-size-md);
  line-height: 1.7;
}
```

Examples of *incorrect* code for this rule:

`index.css`
```css
.def {
  ...
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
