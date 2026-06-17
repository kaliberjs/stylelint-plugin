# media-query-convention

Enforce consistent `@media` query patterns across the codebase.

## Rationale

All Kaliber projects follow a **mobile-first** approach using `min-width` media queries. Using `max-width` queries creates inconsistency and makes responsive behavior harder to reason about.

Additionally, breakpoint values should come from the project's `cssGlobal/media.js` or `media.css` — not from arbitrary ad-hoc values.

## Configuration

Configure `cssGlobal` to enable breakpoint validation:

```json
{
  "kaliber/media-query-convention": [true, {
    "cssGlobal": "src/cssGlobal"
  }]
}
```

The rule reads `media.js` (or `media.css`) from the configured directory and extracts all defined breakpoint values. Without `cssGlobal`, the rule still enforces `min-width` over `max-width` but skips breakpoint validation.

### Supported formats

**media.js** (rabobank, bol, landal, jumbo):
```js
const mediaStyles = {
  viewportMd: 'screen and (min-width: 48rem)',   // → extracts "48rem"
  breakpointMd: '768px',                          // → extracts "768px"
}
```

**media.css** (klm, eiffel):
```css
@custom-media --viewport-md screen and (min-width: 768px);  /* → extracts "768px" */
```

## What this rule checks

- **Disallows `max-width`** breakpoint queries — use `min-width` instead
- **Validates breakpoint values** against `cssGlobal/media` (when configured)
- For the inverse (targeting mobile only), use `@media not screen and (min-width: ...)` or `@media not (min-width: ...)`

## What this rule allows

- **`min-width`** queries with defined breakpoints: `@media screen and (min-width: 48rem)`
- **Negated `min-width`** queries: `@media not screen and (min-width: 80rem)`
- **Non-width features**: `prefers-reduced-motion`, `prefers-color-scheme`, `hover`, `pointer`, `orientation`, `display-mode`, `forced-colors`
- **Print**: `@media print`
- **Complex queries**: `max-width` combined with `orientation` or `max-height` (legitimate edge cases for landscape mobile)

## Examples

### ✅ Valid

```css
/* Mobile-first with defined breakpoint */
.component { @media screen and (min-width: 48rem) { ... } }

/* Mobile-first inverse — also correct */
.component { @media not screen and (min-width: 80rem) { ... } }

/* Non-width features — always allowed */
.component { @media (prefers-reduced-motion: no-preference) { ... } }
```

### ❌ Invalid

```css
/* max-width — desktop-first, not allowed */
.component { @media screen and (max-width: 768px) { ... } }
/* should be: @media not screen and (min-width: 768px) or restructure */

/* Ad-hoc breakpoint — not in media.js */
.component { @media screen and (min-width: 42rem) { ... } }
/* should use a defined breakpoint like 48rem */
```
