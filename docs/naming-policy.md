# Naming policy

Enforces naming conventions for CSS selectors, values, properties, and exports to maintain consistency and prevent conflicts.

## Rules

- [No component class name in nested selectors](#no-component-class-name-in-nested-selectors)
- [Values must start with underscore](#values-must-start-with-underscore)
- [Properties must be lowercase](#properties-must-be-lowercase)
- [No export collisions](#no-export-collisions)
- [No \_root in child selectors](#no-_root-in-child-selectors)

## No component class name in nested selectors

Class names starting with `component` cannot be used in nested selectors. The `component` prefix is reserved for root-level class names.

### Examples

Examples of *correct* code:

```css
.component {
  & > .child {
    margin: 0;
  }
}
```

Examples of *incorrect* code:

```css
.component {
  & > .componentChild {
    margin: 0;
  }
}
```

## Values must start with underscore

All `@value` declarations must start with an underscore (`_`). This prevents naming conflicts with CSS class exports. If you want to export a value, use `:export { ... }` instead.

### Examples

Examples of *correct* code:

```css
@value _spacing: 16px;
@value _color-primary: #0066cc;
```

Examples of *incorrect* code:

```css
@value spacing: 16px;
@value color-primary: #0066cc;
```

## Properties must be lowercase

All CSS properties must be written in lowercase. Mixed-case properties (except custom properties starting with `--`) are not allowed.

### Examples

Examples of *correct* code:

```css
.component {
  background-color: red;
  --myCustomProp: blue;
}
```

Examples of *incorrect* code:

```css
.component {
  Background-Color: red;
}
```

## No export collisions

A `:export` declaration cannot use a name that already exists as a class selector in the same file. This prevents ambiguous module exports.

### Examples

Examples of *correct* code:

```css
.component { }

:export {
  spacing: 16px;
}
```

Examples of *incorrect* code:

```css
.component { }

:export {
  component: true; /* collides with .component class */
}
```

## No \_root in child selectors

Selectors starting with `_root` or `component_root` cannot be used as child selectors within nested rules. Root selectors are meant to be top-level only.

### Examples

Examples of *correct* code:

```css
._root {
  & > .child {
    margin: 0;
  }
}
```

Examples of *incorrect* code:

```css
.component {
  & > ._rootSomething {
    margin: 0;
  }
}
```
