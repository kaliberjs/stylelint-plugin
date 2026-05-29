# @kaliber/stylelint-plugin

This Stylelint plugin enforces Kaliber's code conventions, helping maintain consistency across projects.

## Usage

To use this plugin in your project, create an `.stylelintrc` file with the following content:

```json
{
  "ignoreFiles": ["node_modules/**/*", "**/*.js", "**/*.svg", "**/*.md"],
  "extends": "@kaliber/stylelint-plugin/.stylelintrc"
}
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

## Publishing a new version

To publish a new version, run the following commands:

```sh
>> yarn publish
>> git push
>> git push --tags
```
