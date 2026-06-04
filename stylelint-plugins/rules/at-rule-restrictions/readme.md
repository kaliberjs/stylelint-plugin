# At-rule restrictions

Restricts where `@import` at-rules can be used.

- [No import](#no-import)

## No import

`@import` is only allowed in `*.entry.css` files. Component CSS files should not import other CSS files — this leads to tight coupling and makes it hard to understand the dependency graph.

### How do I do ...

In the past `@import` rules were mostly used to bring in custom properties. These are now available automagically by placing them in the `src/cssGlobal` directory.

Another use of `@import` is to bring in font's. The `index` rule allows for this in the `index.css` file.

### Examples

Examples of *correct* code for this rule:

`app.entry.css`:
```css
@import './reset.css';
@import './index.css';
```

`index.css`:
```css
@import url('./fonts/inter.css');
```

Examples of *incorrect* code for this rule:

`Component.css`:
```css
@import './shared.css'; /* not allowed outside entry files */
```
