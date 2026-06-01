# Reset

The `reset.css` file is for resetting browser default styles using tag selectors. Class selectors are not allowed — even when wrapped in `:global(...)`.

This rule also allows `@kaliber-scoped` in `reset.css` but only for custom elements (e.g. `my-element`).

Certain layout properties that are normally forbidden in root rules are allowed in `reset.css` because resets often need to set default dimensions and margins on elements:

- `width`, `height`
- `max-width`, `max-height`
- `margin`, `margin-top`, `margin-right`, `margin-bottom`, `margin-left`

## Examples

Examples of *correct* code:

`reset.css`:
```css
* {
  box-sizing: border-box;
}

body {
  margin: 0;
}

img {
  max-width: 100%;
  height: auto;
}

@kaliber-scoped my-component;
```

Examples of *incorrect* code:

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
