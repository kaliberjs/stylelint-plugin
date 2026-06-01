# At-rule restrictions

Restricts where `@import` at-rules can be used.

## @import

`@import` is only allowed in `*.entry.css` files. Component CSS files should not import other CSS files — this leads to tight coupling and makes it hard to understand the dependency graph.

For shared values like custom properties, place them in `src/cssGlobal/` instead.

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
