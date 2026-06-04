# CSS global

`:root` selectors — used for defining custom properties — are only meaningful when defined globally. This rule enforces that `:root` lives in the `cssGlobal` directory and that the `cssGlobal` directory only contains `:root` rules.

This two-way enforcement prevents:
- Scattered `:root` declarations across component files
- Non-global features leaking into the global scope

In order to facilitate the use of real `:root` definitions, @kaliber/build picks up any definitions placed in `src/cssGlobal`.

## Interactions with other rules

- **layout-related-properties** — custom property declarations (`--*`) in nested selectors within `cssGlobal` are exempt from the "only layout properties in nested" restriction

## Examples

Examples of *correct* code for this rule:

`src/cssGlobal/variables.css`:
```css
:root {
  --color-primary: #0066cc;
}
```

`Component.css`:
```css
.component {
  color: var(--color-primary);
}
```

Examples of *incorrect* code for this rule:

`Component.css`:
```css
/* :root can only be used in cssGlobal */
:root {
  --color-primary: #0066cc;
}
```

`src/cssGlobal/abc.css`:
```css
/* Regular class selectors are not allowed in cssGlobal */
.component {
  color: red;
}

div {
  ...
}

@keyframes x {
  ...
}

@media x {
  ...
}
```

`src/notCssGlobal/abc.css`:
```css
:root {
  --x: 0;
}
```
