# @kaliber/stylelint-plugin

This Stylelint plugin enforces Kaliber's code conventions, helping maintain consistency across projects.

## Usage

To use this plugin in your project, create an `.stylelintrc` file with the following content:

```json
{
  "ignoreFiles": ["node_modules/**/*", "**/*.js", "**/*.svg", "**/*.md"],
  "extends": "./node_modules/@kaliber/stylelint-plugin/.stylelintrc"
}
```

## Publishing a new version

To publish a new version, run the following commands:

```sh
>> yarn publish
>> git push
>> git push --tags
```
