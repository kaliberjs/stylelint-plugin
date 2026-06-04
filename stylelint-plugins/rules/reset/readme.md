# Reset

The `reset.css` file is for resetting browser default styles using tag selectors. Class selectors are not allowed — even when wrapped in `:global(...)`.

It is typically imported as `import 'reset.css'` from a non-universal component.

Certain layout properties that are normally forbidden in root rules are allowed in `reset.css` because resets often need to set default dimensions and margins on elements:

- `width`, `height`
- `max-width`, `max-height`
- `margin`, `margin-top`, `margin-right`, `margin-bottom`, `margin-left`

## Scoping index styles

See [the documentation of `index.css`](../index) for details.

## Examples

Examples of *correct* code for this rule:

`reset.css`:
```css
*,
*::before,
*::after {
  margin: 0;
}

body {
  margin: 0;
}

img {
  max-width: 100%;
  height: auto;
}

address { font-style: normal; }

button {
  background-color: transparent;
  padding: 0;
  border: none;
  cursor: pointer;
  color: currentColor;
}
```

Examples of *incorrect* code for this rule:

`reset.css`:
```css
/* class selectors are not allowed in reset.css */
.container {
  width: 100%;
}
```

`reset.css`:
```css
/* :global() class selectors are also not allowed */
:global(.container) {
  width: 100%;
}
```
