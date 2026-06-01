# At-rule restrictions

Restricts where `@import` at-rules can be used.

## @import

`@import` is only allowed in `*.entry.css` files. Component CSS files should not import other CSS files — this leads to tight coupling and makes it hard to understand the dependency graph.

For shared values like custom properties, place them in `src/cssGlobal/` instead.

Other rules may allow specific imports:
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
@import url('./fonts/inter.css');
```

Examples of *incorrect* code:

`Component.css`:
```css
@import './shared.css'; /* not allowed outside entry files */
```
