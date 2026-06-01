# CSS global

`:root` selectors — used for defining custom properties — are only meaningful when defined globally. This rule enforces that `:root` lives in the `cssGlobal` directory and that the `cssGlobal` directory only contains `:root` rules.

This two-way enforcement prevents:
- Scattered `:root` declarations across component files
- Non-global features leaking into the global scope

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

`src/cssGlobal/variables.css`:
```css
/* Regular class selectors are not allowed in cssGlobal */
.component {
  color: red;
}
```
