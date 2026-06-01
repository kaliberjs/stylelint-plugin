# Color schemes

Color scheme files (files matching `colorScheme*.css`) are special-purpose CSS files that should only contain color-related properties. This rule enforces that separation, keeping color theming isolated from layout and structure.

By keeping color scheme files pure, you can swap or layer color themes without accidentally breaking layout, typography, or spacing.

## Allowed properties

Only these properties may appear in color scheme files:

- `color`
- `background-color`
- `border-color`
- `stroke`
- `fill`

## Interactions with other rules

When a file is recognized as a color scheme:

- **layout-related-properties** — layout property restrictions in nested selectors are relaxed (the entire file is exempt)
- **selector-policy** — double selectors and non-direct-child selectors are allowed

## Examples

Examples of *correct* code for this rule:

`colorScheme.css`:
```css
.component {
  color: #333;
  background-color: #fff;
}
```

`colorSchemeDark.css`:
```css
.component {
  color: #eee;
  background-color: #1a1a1a;
  border-color: #333;
}
```

Examples of *incorrect* code for this rule:

`colorScheme.css`:
```css
.component {
  color: #333;
  padding: 16px; /* not a color-related property */
}
```

`colorScheme.css`:
```css
.component {
  font-size: 14px; /* not a color-related property */
}
```
