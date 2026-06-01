# Rules Overview

| Name | Description | Source | Configuration |
|---|---|---|---|
| **Custom Rules (kaliber/)** | | | |
| kaliber/color-schemes | Only color-related properties are allowed in color scheme files | Custom | `true` |
| kaliber/css-global | Restrict `:root`, `@custom-media`, `@custom-selector`, and `@value` to the `cssGlobal` directory | Custom | `true` |
| kaliber/layout-related-properties | Layout properties (margin, position, z-index, etc.) belong in nested selectors, not root rules | Custom | `true` |
| kaliber/naming-policy | Enforce naming conventions for selectors, values, properties, and exports | Custom | `true` |
| kaliber/selector-policy | Only direct child selectors, no double nesting, no tag selectors outside reset/index | Custom | `true` |
| kaliber/parent-child-policy | Child properties require matching parent context (flex children need display: flex, etc.) | Custom | `true` |
| kaliber/root-policy | Root-level z-index must create a valid stacking context with position: relative | Custom | `true` |
| kaliber/at-rule-restrictions | Restrict `@import` to entry files and `@kaliber-scoped` to whitelisted locations | Custom | `true` |
| kaliber/index | Only tag selectors allowed in `index.css` — no class selectors | Custom | `true` |
| kaliber/reset | Only tag selectors allowed in `reset.css` — no class selectors | Custom | `true` |
| **Third-Party Rules** | | | |
| **stylelint-use-nesting** | | | |
| csstools/use-nesting | Enforce nesting when it is possible | [stylelint-use-nesting](https://github.com/csstools/stylelint-use-nesting) | `["always", {"except": ["*:checked +"]}]` |
| **@stylistic/stylelint-plugin** | | | |
| @stylistic/at-rule-name-case | Specify lowercase for at-rule names | [@stylistic/stylelint-plugin](https://github.com/stylelint-stylistic/stylelint-stylistic) | `"lower"` |
| @stylistic/at-rule-name-space-after | Require a single space after at-rule names | [@stylistic/stylelint-plugin](https://github.com/stylelint-stylistic/stylelint-stylistic) | `"always-single-line"` |
| @stylistic/at-rule-semicolon-newline-after | Require a newline after the semicolon of at-rules | [@stylistic/stylelint-plugin](https://github.com/stylelint-stylistic/stylelint-stylistic) | `"always"` |
| @stylistic/block-closing-brace-empty-line-before | Require or disallow an empty line before the closing brace of blocks | [@stylistic/stylelint-plugin](https://github.com/stylelint-stylistic/stylelint-stylistic) | `"never"` |
| @stylistic/block-closing-brace-newline-after | Require a newline after the closing brace of blocks | [@stylistic/stylelint-plugin](https://github.com/stylelint-stylistic/stylelint-stylistic) | `"always"` |
| @stylistic/block-closing-brace-newline-before | Require a newline before the closing brace of blocks | [@stylistic/stylelint-plugin](https://github.com/stylelint-stylistic/stylelint-stylistic) | `"always-multi-line"` |
| @stylistic/block-closing-brace-space-before | Require a single space before the closing brace of blocks | [@stylistic/stylelint-plugin](https://github.com/stylelint-stylistic/stylelint-stylistic) | `"always-single-line"` |
| @stylistic/block-opening-brace-newline-after | Require a newline after the opening brace of blocks | [@stylistic/stylelint-plugin](https://github.com/stylelint-stylistic/stylelint-stylistic) | `"always-multi-line"` |
| @stylistic/block-opening-brace-space-after | Require a single space after the opening brace of blocks | [@stylistic/stylelint-plugin](https://github.com/stylelint-stylistic/stylelint-stylistic) | `"always-single-line"` |
| @stylistic/block-opening-brace-space-before | Require a single space before the opening brace of blocks | [@stylistic/stylelint-plugin](https://github.com/stylelint-stylistic/stylelint-stylistic) | `"always"` |
| @stylistic/color-hex-case | Specify lowercase for hex colors | [@stylistic/stylelint-plugin](https://github.com/stylelint-stylistic/stylelint-stylistic) | `"lower"` |
| @stylistic/declaration-bang-space-after | Require a single space or disallow whitespace after the bang of declarations | [@stylistic/stylelint-plugin](https://github.com/stylelint-stylistic/stylelint-stylistic) | `"never"` |
| @stylistic/declaration-bang-space-before | Require a single space before the bang of declarations | [@stylistic/stylelint-plugin](https://github.com/stylelint-stylistic/stylelint-stylistic) | `"always"` |
| @stylistic/declaration-block-semicolon-newline-after | Require a newline after the semicolon of declaration blocks | [@stylistic/stylelint-plugin](https://github.com/stylelint-stylistic/stylelint-stylistic) | `"always-multi-line"` |
| @stylistic/declaration-block-semicolon-space-after | Require a single space after the semicolon of declaration blocks | [@stylistic/stylelint-plugin](https://github.com/stylelint-stylistic/stylelint-stylistic) | `"always-single-line"` |
| @stylistic/declaration-block-semicolon-space-before | Disallow whitespace before the semicolons of declaration blocks | [@stylistic/stylelint-plugin](https://github.com/stylelint-stylistic/stylelint-stylistic) | `"never"` |
| @stylistic/declaration-block-trailing-semicolon | Require a trailing semicolon within declaration blocks | [@stylistic/stylelint-plugin](https://github.com/stylelint-stylistic/stylelint-stylistic) | `"always"` |
| @stylistic/declaration-colon-space-after | Require a single space after the colon of declarations | [@stylistic/stylelint-plugin](https://github.com/stylelint-stylistic/stylelint-stylistic) | `"always-single-line"` |
| @stylistic/declaration-colon-space-before | Disallow whitespace before the colon of declarations | [@stylistic/stylelint-plugin](https://github.com/stylelint-stylistic/stylelint-stylistic) | `"never"` |
| @stylistic/function-comma-newline-after | Require a newline after the commas of functions | [@stylistic/stylelint-plugin](https://github.com/stylelint-stylistic/stylelint-stylistic) | `"always-multi-line"` |
| @stylistic/function-comma-space-after | Require a single space after the commas of functions | [@stylistic/stylelint-plugin](https://github.com/stylelint-stylistic/stylelint-stylistic) | `"always-single-line"` |
| @stylistic/function-comma-space-before | Disallow whitespace before the commas of functions | [@stylistic/stylelint-plugin](https://github.com/stylelint-stylistic/stylelint-stylistic) | `"never"` |
| @stylistic/function-max-empty-lines | Limit the number of adjacent empty lines within functions | [@stylistic/stylelint-plugin](https://github.com/stylelint-stylistic/stylelint-stylistic) | `0` |
| @stylistic/function-parentheses-newline-inside | Require a newline inside the parentheses of functions | [@stylistic/stylelint-plugin](https://github.com/stylelint-stylistic/stylelint-stylistic) | `"always-multi-line"` |
| @stylistic/function-parentheses-space-inside | Disallow whitespace on the inside of the parentheses of functions | [@stylistic/stylelint-plugin](https://github.com/stylelint-stylistic/stylelint-stylistic) | `"never-single-line"` |
| @stylistic/function-whitespace-after | Require whitespace after functions | [@stylistic/stylelint-plugin](https://github.com/stylelint-stylistic/stylelint-stylistic) | `"always"` |
| @stylistic/indentation | Specify indentation | [@stylistic/stylelint-plugin](https://github.com/stylelint-stylistic/stylelint-stylistic) | `2` |
| @stylistic/max-empty-lines | Limit the number of adjacent empty lines | [@stylistic/stylelint-plugin](https://github.com/stylelint-stylistic/stylelint-stylistic) | `1` |
| @stylistic/media-feature-colon-space-after | Require a single space after the colon in media features | [@stylistic/stylelint-plugin](https://github.com/stylelint-stylistic/stylelint-stylistic) | `"always"` |
| @stylistic/media-feature-colon-space-before | Disallow whitespace before the colon in media features | [@stylistic/stylelint-plugin](https://github.com/stylelint-stylistic/stylelint-stylistic) | `"never"` |
| @stylistic/media-feature-name-case | Specify lowercase for media feature names | [@stylistic/stylelint-plugin](https://github.com/stylelint-stylistic/stylelint-stylistic) | `"lower"` |
| @stylistic/media-feature-parentheses-space-inside | Disallow whitespace on the inside of the parentheses in media features | [@stylistic/stylelint-plugin](https://github.com/stylelint-stylistic/stylelint-stylistic) | `"never"` |
| @stylistic/media-feature-range-operator-space-after | Require a single space after the range operator in media features | [@stylistic/stylelint-plugin](https://github.com/stylelint-stylistic/stylelint-stylistic) | `"always"` |
| @stylistic/media-feature-range-operator-space-before | Require a single space before the range operator in media features | [@stylistic/stylelint-plugin](https://github.com/stylelint-stylistic/stylelint-stylistic) | `"always"` |
| @stylistic/media-query-list-comma-newline-after | Require a newline after the commas of media query lists | [@stylistic/stylelint-plugin](https://github.com/stylelint-stylistic/stylelint-stylistic) | `"always-multi-line"` |
| @stylistic/media-query-list-comma-space-after | Require a single space after the commas of media query lists | [@stylistic/stylelint-plugin](https://github.com/stylelint-stylistic/stylelint-stylistic) | `"always-single-line"` |
| @stylistic/media-query-list-comma-space-before | Disallow whitespace before the commas of media query lists | [@stylistic/stylelint-plugin](https://github.com/stylelint-stylistic/stylelint-stylistic) | `"never"` |
| @stylistic/no-eol-whitespace | Disallow end-of-line whitespace | [@stylistic/stylelint-plugin](https://github.com/stylelint-stylistic/stylelint-stylistic) | `true` |
| @stylistic/no-extra-semicolons | Disallow extra semicolons | [@stylistic/stylelint-plugin](https://github.com/stylelint-stylistic/stylelint-stylistic) | `true` |
| @stylistic/no-missing-end-of-source-newline | Disallow missing end-of-source newlines | [@stylistic/stylelint-plugin](https://github.com/stylelint-stylistic/stylelint-stylistic) | `true` |
| @stylistic/number-leading-zero | Require a leading zero for fractional numbers less than 1 | [@stylistic/stylelint-plugin](https://github.com/stylelint-stylistic/stylelint-stylistic) | `"always"` |
| @stylistic/number-no-trailing-zeros | Disallow trailing zeros in numbers | [@stylistic/stylelint-plugin](https://github.com/stylelint-stylistic/stylelint-stylistic) | `true` |
| @stylistic/property-case | Specify lowercase for properties | [@stylistic/stylelint-plugin](https://github.com/stylelint-stylistic/stylelint-stylistic) | `null` |
| @stylistic/selector-attribute-brackets-space-inside | Disallow whitespace on the inside of the brackets within attribute selectors | [@stylistic/stylelint-plugin](https://github.com/stylelint-stylistic/stylelint-stylistic) | `"never"` |
| @stylistic/selector-attribute-operator-space-after | Disallow whitespace after the operator within attribute selectors | [@stylistic/stylelint-plugin](https://github.com/stylelint-stylistic/stylelint-stylistic) | `"never"` |
| @stylistic/selector-attribute-operator-space-before | Disallow whitespace before the operator within attribute selectors | [@stylistic/stylelint-plugin](https://github.com/stylelint-stylistic/stylelint-stylistic) | `"never"` |
| @stylistic/selector-combinator-space-after | Require a single space after the combinators of selectors | [@stylistic/stylelint-plugin](https://github.com/stylelint-stylistic/stylelint-stylistic) | `"always"` |
| @stylistic/selector-combinator-space-before | Require a single space before the combinators of selectors | [@stylistic/stylelint-plugin](https://github.com/stylelint-stylistic/stylelint-stylistic) | `"always"` |
| @stylistic/selector-descendant-combinator-no-non-space | Disallow non-space characters for descendant combinators of selectors | [@stylistic/stylelint-plugin](https://github.com/stylelint-stylistic/stylelint-stylistic) | `true` |
| @stylistic/selector-list-comma-newline-after | Require a newline after the commas of selector lists | [@stylistic/stylelint-plugin](https://github.com/stylelint-stylistic/stylelint-stylistic) | `"always"` |
| @stylistic/selector-list-comma-space-before | Disallow whitespace before the commas of selector lists | [@stylistic/stylelint-plugin](https://github.com/stylelint-stylistic/stylelint-stylistic) | `"never"` |
| @stylistic/selector-max-empty-lines | Limit the number of adjacent empty lines within selectors | [@stylistic/stylelint-plugin](https://github.com/stylelint-stylistic/stylelint-stylistic) | `0` |
| @stylistic/selector-pseudo-class-case | Specify lowercase for pseudo-class selectors | [@stylistic/stylelint-plugin](https://github.com/stylelint-stylistic/stylelint-stylistic) | `"lower"` |
| @stylistic/selector-pseudo-class-parentheses-space-inside | Disallow whitespace on the inside of the parentheses within pseudo-class selectors | [@stylistic/stylelint-plugin](https://github.com/stylelint-stylistic/stylelint-stylistic) | `"never"` |
| @stylistic/selector-pseudo-element-case | Specify lowercase for pseudo-element selectors | [@stylistic/stylelint-plugin](https://github.com/stylelint-stylistic/stylelint-stylistic) | `"lower"` |
| @stylistic/unit-case | Specify lowercase for units | [@stylistic/stylelint-plugin](https://github.com/stylelint-stylistic/stylelint-stylistic) | `"lower"` |
| @stylistic/value-list-comma-newline-after | Require a newline after the commas of value lists | [@stylistic/stylelint-plugin](https://github.com/stylelint-stylistic/stylelint-stylistic) | `"always-multi-line"` |
| @stylistic/value-list-comma-space-after | Require a single space after the commas of value lists | [@stylistic/stylelint-plugin](https://github.com/stylelint-stylistic/stylelint-stylistic) | `"always-single-line"` |
| @stylistic/value-list-comma-space-before | Disallow whitespace before the commas of value lists | [@stylistic/stylelint-plugin](https://github.com/stylelint-stylistic/stylelint-stylistic) | `"never"` |
| @stylistic/value-list-max-empty-lines | Limit the number of adjacent empty lines within value lists | [@stylistic/stylelint-plugin](https://github.com/stylelint-stylistic/stylelint-stylistic) | `0` |
| **Stylelint Core Rules** | | | |
| at-rule-disallowed-list | Specify a list of disallowed at-rules | [Stylelint](https://stylelint.io/user-guide/rules/) | `["apply", "annotation", ...]` |
| at-rule-no-unknown | Disallow unknown at-rules | [Stylelint](https://stylelint.io/user-guide/rules/) | `[true, {"ignoreAtRules": ["value", "kaliber-scoped"]}]` |
| at-rule-empty-line-before | Require or disallow an empty line before at-rules | [Stylelint](https://stylelint.io/user-guide/rules/) | `["always", {...}]` |
| block-no-empty | Disallow empty blocks | [Stylelint](https://stylelint.io/user-guide/rules/) | `true` |
| color-hex-length | Specify short notation for hex colors | [Stylelint](https://stylelint.io/user-guide/rules/) | `"short"` |
| color-no-invalid-hex | Disallow invalid hex colors | [Stylelint](https://stylelint.io/user-guide/rules/) | `true` |
| comment-empty-line-before | Require or disallow an empty line before comments | [Stylelint](https://stylelint.io/user-guide/rules/) | `["always", {...}]` |
| comment-no-empty | Disallow empty comments | [Stylelint](https://stylelint.io/user-guide/rules/) | `true` |
| comment-whitespace-inside | Require whitespace on the inside of comment markers | [Stylelint](https://stylelint.io/user-guide/rules/) | `"always"` |
| custom-property-empty-line-before | Require or disallow an empty line before custom properties | [Stylelint](https://stylelint.io/user-guide/rules/) | `null` |
| declaration-block-no-duplicate-properties | Disallow duplicate properties within declaration blocks | [Stylelint](https://stylelint.io/user-guide/rules/) | `[true, {"ignore": ["consecutive-duplicates-with-different-values"]}]` |
| declaration-block-no-shorthand-property-overrides | Disallow shorthand properties that override related longhand properties | [Stylelint](https://stylelint.io/user-guide/rules/) | `true` |
| declaration-block-single-line-max-declarations | Limit the number of declarations within a single-line declaration block | [Stylelint](https://stylelint.io/user-guide/rules/) | `1` |
| declaration-empty-line-before | Require or disallow an empty line before declarations | [Stylelint](https://stylelint.io/user-guide/rules/) | `["always", {...}]` |
| font-family-no-duplicate-names | Disallow duplicate font family names | [Stylelint](https://stylelint.io/user-guide/rules/) | `true` |
| function-linear-gradient-no-nonstandard-direction | Disallow direction values in `linear-gradient()` calls that are not valid | [Stylelint](https://stylelint.io/user-guide/rules/) | `true` |
| function-name-case | Specify lowercase for function names | [Stylelint](https://stylelint.io/user-guide/rules/) | `"lower"` |
| keyframe-declaration-no-important | Disallow `!important` within keyframe declarations | [Stylelint](https://stylelint.io/user-guide/rules/) | `true` |
| length-zero-no-unit | Disallow units for zero lengths | [Stylelint](https://stylelint.io/user-guide/rules/) | `true` |
| media-feature-name-no-unknown | Disallow unknown media feature names | [Stylelint](https://stylelint.io/user-guide/rules/) | `true` |
| no-descending-specificity | Disallow selectors of lower specificity from coming after overriding selectors of higher specificity | [Stylelint](https://stylelint.io/user-guide/rules/) | `null` |
| no-duplicate-at-import-rules | Disallow duplicate `@import` rules | [Stylelint](https://stylelint.io/user-guide/rules/) | `true` |
| no-duplicate-selectors | Disallow duplicate selectors within a stylesheet | [Stylelint](https://stylelint.io/user-guide/rules/) | `true` |
| no-empty-source | Disallow empty sources | [Stylelint](https://stylelint.io/user-guide/rules/) | `true` |
| no-invalid-double-slash-comments | Disallow double-slash comments (`//...`) which are not supported by CSS | [Stylelint](https://stylelint.io/user-guide/rules/) | `true` |
| property-no-unknown | Disallow unknown properties | [Stylelint](https://stylelint.io/user-guide/rules/) | `[true, {"ignoreSelectors": ":export", "ignoreProperties": ["container-type", "interpolate-size"]}]` |
| rule-empty-line-before | Require or disallow an empty line before rules | [Stylelint](https://stylelint.io/user-guide/rules/) | `["always-multi-line", {...}]` |
| selector-pseudo-class-no-unknown | Disallow unknown pseudo-class selectors | [Stylelint](https://stylelint.io/user-guide/rules/) | `[true, {"ignorePseudoClasses": ["global", "export"]}]` |
| selector-pseudo-element-colon-notation | Specify double colon notation for applicable pseudo-elements | [Stylelint](https://stylelint.io/user-guide/rules/) | `"double"` |
| selector-pseudo-element-no-unknown | Disallow unknown pseudo-element selectors | [Stylelint](https://stylelint.io/user-guide/rules/) | `true` |
| selector-type-case | Specify lowercase for type selectors | [Stylelint](https://stylelint.io/user-guide/rules/) | `"lower"` |
| selector-type-no-unknown | Disallow unknown type selectors | [Stylelint](https://stylelint.io/user-guide/rules/) | `[true, {"ignore": ["custom-elements"]}]` |
| string-no-newline | Disallow newlines in strings | [Stylelint](https://stylelint.io/user-guide/rules/) | `true` |
| unit-no-unknown | Disallow unknown units | [Stylelint](https://stylelint.io/user-guide/rules/) | `null` |
| unit-allowed-list | Specify a list of allowed units | [Stylelint](https://stylelint.io/user-guide/rules/) | `["em", "rem", "px", "ex", "%", "ms", "s", "vh", "vw", ...]` |
