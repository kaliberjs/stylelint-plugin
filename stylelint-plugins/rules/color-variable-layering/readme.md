# color-variable-layering

Enforce that component CSS only uses context-layer color tokens (not palette or semantic tokens).

## Rationale

Kaliber projects use a three-layer color architecture:

```
Layer 1 (Palette)  : --color-teal, --color-blue-500, --color-granite
                     ↕ defined in color.css / themes/*.css

Layer 2 (Semantic) : --color-primary, --color-surface, --color-text
                     ↕ defined in themes/*.css, mapped from palette

Layer 3 (Context)  : --color, --background-color, --accent-color
                     ↕ defined in style-contexts.css, mapped from semantic
                     ↕ THIS is what components should use
```

Each layer varies at a different scope:
- **Palette** is fixed per brand (rabobank vs landal)
- **Semantic** is fixed per theme (`[data-theme-context]`) — same across all style contexts
- **Context** varies per `[data-style-context]` — adapts to light/dark/blue/etc.

Using `var(--color-primary)` in a component **won't adapt** when the component sits inside `[data-style-context='dark']`. In the dark context, `--accent-color` maps to `--color-primary-light` (not `--color-primary`).

## Configuration

This rule accepts an options object with the following properties:

- `cssGlobal` (required): Relative path pointing to your `cssGlobal` directory.
- `styleContextFiles` (optional): Array of filenames within `cssGlobal` to scan for context tokens. Defaults to `['style-context.css', 'style-contexts.css']`.
- `ignoreFiles` (optional): Array of patterns (substrings or regex strings like `"/my-custom-theme/"`) specifying files to skip validation on.
- `suggestions` (optional): Dictionary mapping semantic or palette tokens (keys) to recommended context replacements (values). Keys can be exact match strings or regex pattern strings.

Example:

```json
{
  "kaliber/color-variable-layering": [true, {
    "cssGlobal": "src/cssGlobal",
    "styleContextFiles": ["style-contexts.css"],
    "ignoreFiles": ["/custom-infra/", "legacyTheme"],
    "suggestions": {
      "--color-primary-brand": "--accent-color",
      "^--color-gray-\\d+$": "--shade-color"
    }
  }]
}
```

Without `cssGlobal`, the rule is a no-op.

## How it works

The rule **reads the configured `contextFile`** at lint-time to discover which custom properties are context-layer tokens (the left-hand side of declarations inside `[data-style-context]` blocks). Any `var(--color-*)` reference in component CSS that isn't in the discovered context token list gets flagged.

## What this rule checks

In **component CSS files**, this rule flags:
- Palette tokens: `var(--color-blue-500)`, `var(--color-gray-200)`, `var(--color-teal)`
- Semantic tokens: `var(--color-primary)`, `var(--color-surface)`, `var(--color-text)`

## What this rule allows

- **Context tokens**: `var(--color)`, `var(--accent-color)`, `var(--background-color)`, etc.
- **Non-color variables**: `var(--size-16)`, `var(--font-size-md)`, etc.
- **Custom property definitions**: `--my-gradient: var(--color-primary)` — defining tokens is allowed
- **Infrastructure files**: `cssGlobal/`, `style-contexts.css`, `colorScheme*.css`

## Examples

### ✅ Valid

```css
/* features/buildingBlocks/Button.css */
.component { color: var(--color); background-color: var(--accent-color); }
```

```css
/* Custom property definition — allowed */
.component { --card-overlay: var(--color-primary); }
```

### ❌ Invalid

```css
/* features/buildingBlocks/ApplyBanner.css — semantic token leak */
.component { background-color: var(--color-primary); }
/* should be: var(--accent-color) or var(--button-background-color) */
```

```css
/* pages/Skills.css — palette token leak */
.component { background-color: var(--color-gray-200); }
/* should be: var(--shade-color) */
```
