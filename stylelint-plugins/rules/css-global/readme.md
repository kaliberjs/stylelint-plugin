# CSS Global

This rule restricts the definition of custom properties to the `src/cssGlobal` directory.

Defining custom properties inside arbitrary CSS files does not make sense, this case becomes even stronger when modules are in use. Having these in arbitrary files could cause trouble. In order to facilitate the use of real `:root` definitions, @kaliber/build picks up any definitions placed in `src/cssGlobal`.

## Examples

Examples of *correct* code for this rule:

`src/cssGlobal/abc.css`
```css
:root {
  --x: 0;
}
```

Examples of *incorrect* code for this rule:

`src/cssGlobal/abc.css`
```css
div {
  ...
}

.test {
  ...
}

@keyframes x {
  ...
}

@media x {
  ...
}
```
`src/notCssGlobal/abc.css`
```css
:root {
  --x: 0;
}
```

## Common refactorings

...
