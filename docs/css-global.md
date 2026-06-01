# CSS global

Certain CSS features are only meaningful when defined globally — custom properties on `:root`, `@custom-media`, `@custom-selector`, and `@value` declarations. This rule enforces that these features live in the `cssGlobal` directory and that the `cssGlobal` directory only contains these features.

This two-way enforcement prevents:
- Scattered `:root` declarations across component files
- Non-global features leaking into the global scope

## What belongs in `cssGlobal/`

| Feature | Allowed in `cssGlobal/` | Exclusive to `cssGlobal/` |
|---|---|---|
| `:root` | ✓ | ✓ |
| `@custom-media` | ✓ | ✓ |
| `@custom-selector` | ✓ | ✓ |
| `@value` | ✓ | |
| `:export` | ✓ | |

Everything else (regular rules, other at-rules) is forbidden inside `cssGlobal/`.

## Interactions with other rules

- **layout-related-properties** — custom property declarations (`--*`) in nested selectors within `cssGlobal` are exempt from the "only layout properties in nested" restriction

## Examples

Examples of *correct* code for this rule:

`src/cssGlobal/variables.css`:
```css
:root {
  --color-primary: #0066cc;
}

@custom-media --viewport-small (max-width: 600px);
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

`Component.css`:
```css
/* @custom-media can only be used in cssGlobal */
@custom-media --viewport-small (max-width: 600px);
```

`src/cssGlobal/variables.css`:
```css
/* Regular class selectors are not allowed in cssGlobal */
.component {
  color: red;
}
```
