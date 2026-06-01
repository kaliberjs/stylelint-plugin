# At-rule restrictions

Restricts where `@import` and `@kaliber-scoped` at-rules can be used.

## @import

`@import` is only allowed in `*.entry.css` files. Component CSS files should not import other CSS files — this leads to tight coupling and makes it hard to understand the dependency graph.

For shared values like custom properties, custom media, and custom selectors, place them in `src/cssGlobal/` instead.

Other rules may allow specific imports:
- **index** rule allows `@import` in `index.css` but only for fonts
- **reset** rule does not currently allow any imports

### Examples

Examples of *correct* code:

`app.entry.css`:
```css
@import './reset.css';
@import './index.css';
```

`index.css`:
```css
@import url('https://fonts.googleapis.com/css2?family=Inter');
```

Examples of *incorrect* code:

`Component.css`:
```css
@import './shared.css'; /* not allowed outside entry files */
```

## @kaliber-scoped

`@kaliber-scoped` is only allowed in locations that have been whitelisted by other rules. By default, it is forbidden everywhere.

Other rules may allow it:
- **index** rule allows `@kaliber-scoped` in `index.css` but only for custom elements (e.g. `my-element`)
- **reset** rule allows `@kaliber-scoped` in `reset.css` but only for custom elements

### Examples

Examples of *correct* code:

`index.css`:
```css
@kaliber-scoped my-custom-element;
```

Examples of *incorrect* code:

`Component.css`:
```css
@kaliber-scoped my-custom-element; /* not allowed here */
```
