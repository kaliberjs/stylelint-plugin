# no-hardcoded-colors

Disallow hardcoded color values (hex, rgb, hsl, etc.) in component CSS files.

## Rationale

Both projects define color tokens in `cssGlobal/color.css` or `cssGlobal/themes/*.css`, then map them through style contexts. When hardcoded color values like `#1a1a1a` or `rgba(0, 0, 0, 0.2)` leak into component CSS, they:

- Bypass the color system entirely
- Won't adapt to style context changes (light/dark)
- Create maintenance burden when brand colors change

## What this rule checks

In **component CSS files** (anything outside `cssGlobal/`, `style-contexts`, and `colorScheme` files), this rule disallows:

- Hex colors: `#fff`, `#000000`, `#RRGGBBAA`
- Color functions: `rgb()`, `rgba()`, `hsl()`, `hsla()`, `hwb()`, `lab()`, `lch()`, `oklch()`, `oklab()`, `color()`

## What this rule allows

- **CSS custom properties**: `var(--color)`, `var(--accent-color)`, etc.
- **Custom property definitions**: `--my-gradient: linear-gradient(...)` — defining a token is allowed
- **Infrastructure files**: `cssGlobal/`, `style-contexts.css`, `colorScheme*.css`
- **Non-color values**: `transparent`, `currentColor`, `inherit`

## Examples

### ✅ Valid

```css
/* features/buildingBlocks/Button.css */
.component { color: var(--color); background-color: var(--accent-color); }
```

```css
/* cssGlobal/color.css — infrastructure file, allowed */
:root { --color-blue-500: #0058ff; }
```

### ❌ Invalid

```css
/* features/buildingBlocks/Panel.css */
.component { background-color: #1a1a1a; }

/* features/buildingBlocks/Overlay.css */
.component { background-color: rgba(0, 0, 0, 0.2); }
```
