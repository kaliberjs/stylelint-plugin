# Color schemes

Color scheme files (files matching `colorScheme*.css` or any path containing `colorScheme`) are special-purpose CSS files that should only contain color-related properties. This rule enforces that separation, keeping color theming isolated from layout and structure.

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

`colorScheme/abc.css`:
```css
.component {
  & .child {
    color: 0;
    background-color: 0;
    border-color: 0;
    stroke: 0;
    fill: 0;
  }
}
```

`colorScheme.css`:
```css
.component {
  & ::selection {
    color: 0;
    background-color: 0;
    border-color: 0;
    stroke: 0;
    fill: 0;
  }
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

`colorScheme/abc.css`:
```css
.component {
  padding: 0;

  & .child {
    margin: 0;
  }
}
```

## Common refactorings

Before:
```css
.abc {
  color: #aabbcc;
  opacity: 0.5;
}
```

After:
```css
.abc {
  color: #aabbcc80;
  /* or */
  color: rgba(170, 187, 204, 0.5);
}
```
