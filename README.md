# @kaliber/stylelint-plugin

Opinionated Stylelint plugin enforcing Kaliber's CSS conventions. Bundles custom rules that promote component-based CSS architecture where components are black boxes with clear boundaries between internal styling and layout positioning.

## Installation

```sh
pnpm add @kaliber/stylelint-plugin
```

> **Requires** Node.js ≥ 20.19.0

## Usage

Create a `.stylelintrc` file in your project root:

```json
{
  "ignoreFiles": ["node_modules/**/*", "**/*.js", "**/*.svg", "**/*.md"],
  "extends": "@kaliber/stylelint-plugin/.stylelintrc"
}
```

## Custom rules

| Rule | Description |
|---|---|
| [`color-schemes`](stylelint-plugins/rules/color-schemes/readme.md) | Only color-related properties are allowed in color scheme files |
| [`css-global`](stylelint-plugins/rules/css-global/readme.md) | Restrict `:root` to the `cssGlobal` directory |
| [`layout-related-properties`](stylelint-plugins/rules/layout-related-properties/readme.md) | Layout properties (margin, position, z-index, etc.) belong in nested selectors, not root rules |
| [`naming-policy`](stylelint-plugins/rules/naming-policy/readme.md) | Enforce naming conventions for selectors and properties |
| [`selector-policy`](stylelint-plugins/rules/selector-policy/readme.md) | Only direct child selectors, no double nesting, no tag selectors outside reset/index |
| [`parent-child-policy`](stylelint-plugins/rules/parent-child-policy/readme.md) | Child properties require matching parent context (flex children need `display: flex`, etc.) |
| [`root-policy`](stylelint-plugins/rules/root-policy/readme.md) | Root-level `z-index` must create a valid stacking context with `position: relative` |
| [`at-rule-restrictions`](stylelint-plugins/rules/at-rule-restrictions/readme.md) | Restrict `@import` to entry files |
| [`index`](stylelint-plugins/rules/index/readme.md) | Only tag selectors allowed in `index.css` — no class selectors |
| [`reset`](stylelint-plugins/rules/reset/readme.md) | Only tag selectors allowed in `reset.css` — no class selectors |

For a complete list of **all** active rules (custom, third-party, and core Stylelint), see [`rules-overview.md`](rules-overview.md).

## Documentation

Each rule has a colocated `readme.md` explaining what it enforces, why, and showing valid/invalid examples. The [`docsUrl`](stylelint-plugins/machinery/docsUrl.js) helper resolves the documentation path from the rule's directory:

```
rules/color-schemes/index.js    →  rules/color-schemes/readme.md
rules/naming-policy/index.js    →  rules/naming-policy/readme.md
```

Each rule exposes two pieces of metadata via `meta.docs`:

- **`description`** — a one-liner explaining what the rule enforces. This is the primary context for both editor tooltips and AI coding assistants.
- **`url`** — a `file://` URL pointing to the full documentation on disk. It resolves locally regardless of where the package is installed (source checkout or `node_modules`), so it works without network access or GitHub authentication.

The [`defineRule`](stylelint-plugins/machinery/defineRule.js) helper validates that every rule has the correct shape (`ruleName`, `meta`, `messages`, `create`). Type definitions are in [`defineRule.d.ts`](stylelint-plugins/machinery/defineRule.d.ts).

### CSS value resolution

Rules lint against the **source CSS as written** — there is no PostCSS preprocessing step. Values that can only be resolved at runtime (`var()`, `calc()`, `env()`) are treated as _potentially valid_ rather than flagged:

- `width: var(--size) !important` → treated as potentially intrinsic ✅
- `display: var(--layout)` with a flex child → parent treated as potentially flex ✅
- `padding-top: calc(9 / 16 * 100%)` → treated as potentially percentage ✅

This is handled by the shared [`containsUnresolvable`](stylelint-plugins/machinery/ast.js) helper.

### Adding documentation for a new rule

1. Create `rules/{rule-name}/readme.md`
2. In the rule's `index.js`, use `defineRule`:
   ```js
   import defineRule from '../../machinery/defineRule.js'
   import docsUrl from '../../machinery/docsUrl.js'

   export default defineRule({
     ruleName: 'rule-name',
     meta: {
       description: 'One-line description of the rule',
       url: docsUrl(import.meta.dirname),
     },
     messages,
     create(config) {
       return ({ originalRoot, report }) => {
         // ...
       }
     }
   })
   ```

## Migrating from v1 to v2

Stylelint has been updated to v17. If you only use `extends` without overriding individual rules, no changes are needed.

If you override formatting rules, they've moved to the `@stylistic/` namespace. Two rules were also renamed:

```diff
 {
   "extends": "@kaliber/stylelint-plugin/.stylelintrc",
   "rules": {
-    "indentation": 4,
+    "@stylistic/indentation": 4,
-    "at-rule-blacklist": ["apply"],
+    "at-rule-disallowed-list": ["apply"],
-    "unit-whitelist": ["px", "rem"],
+    "unit-allowed-list": ["px", "rem"]
   }
 }
```

See the [full list of moved rules](https://github.com/stylelint-stylistic/stylelint-stylistic).

## Tests

> [!CAUTION]
> When saving a 'bad' `.css` file, use <kbd>META + K + S</kbd> (save without formatting); 
> some files (e.g. `bad/file.css`) are deliberately wrongly formatted, which your `onSave` will try to 'fix' (which it should not).

```sh
# Run all tests (integration + unit)
pnpm test

# Integration tests only
pnpm test-integration

# Unit tests only
pnpm test-rules
```

## Publishing

```sh
>> pnpm publish
>> git push
>> git push --tags
```
