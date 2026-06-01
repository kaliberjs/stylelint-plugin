# Naming policy

Enforces naming conventions for CSS selectors and properties to maintain consistency and prevent conflicts.

## Rules

- [No component class name in nested selectors](#no-component-class-name-in-nested-selectors)
- [Properties must be lowercase](#properties-must-be-lowercase)
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
