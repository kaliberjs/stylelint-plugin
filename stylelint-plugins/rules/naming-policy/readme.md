# Naming policy

Enforces naming conventions for CSS selectors and properties to maintain consistency and prevent conflicts.

- [No component class name in nested selectors](#no-component-class-name-in-nested-selectors)
- [Properties must be lowercase](#properties-must-be-lowercase)
- [No \_root in child selectors](#no-_root-in-child-selectors)
- [State](#state)

## No component class name in nested selectors

The `component` name for styles is tightly connected to the root element of a component. This means that when you are using it in a child selector something is wrong. In most cases you are trying to set some layout related properties of a component that happens to be in the same file. Doing so causes you to cross that magical component black-box, preventing your future self from moving the component to another file.

Concretely, the following should be refactored as shown:

```css
.component {
  color: green;

  & > .componentAbc {
    margin-bottom: 10px;
  }
}

.componentAbc {
  color: red;
}
```

```css
.component {
  color: green;

  & > .abc {
    margin-bottom: 10px;
  }
}

.componentAbc {
  color: red;
}
```

### Examples

Examples of *correct* code for this rule:

```css
.component {
  & > .child {
    margin: 0;
  }
}
```

```css
.componentAbc {
  & > .test {
    ...
  }
}
```

Examples of *incorrect* code for this rule:

```css
.component {
  & > .componentChild {
    margin: 0;
  }
}
```

```css
.componentAbc {
  & > .component {
    ...
  }
}
```

## Properties must be lowercase

All CSS properties must be written in lowercase. Custom properties (`--*`) are excluded from this check.

### Examples

Examples of *correct* code for this rule:

```css
.component {
  background-color: red;
  --myCustomProp: blue;
}
```

Examples of *incorrect* code for this rule:

```css
.component {
  Background-Color: red;
}
```

```css
.test {
  COLOR: red;
  Display: none;
}
```

## No \_root in child selectors

Selectors `_root` and `component_root` have a special status as they indicate that the component or element starts a new context that you have control over. A couple of use cases:

- Slides within a carousel that you did not create
- A popup window

The `_root` and `component_root` selectors are only allowed as top-level selector. It does not make sense to reference them as a child of a parent rule; it would mean it is not actually a root.

These selectors allow you to use layout related props in a top-level selector which is normally prevented. In most cases you won't need a `_root` or `component_root` selector, use them only when you absolutely need them and when 'root' feels like an appropriate description of the situation.

### Examples

Examples of *correct* code for this rule:

```css
._root {
  & > .child {
    margin: 0;
  }
}
```

```css
_rootAbc {
  position: absolute;
  top: 60%;
  width: 100%;
}
```

Examples of *incorrect* code for this rule:

```css
.component {
  & > ._rootSomething {
    margin: 0;
  }
}
```

```css
.test {
  & > _root {
  }
}
```

## State

This policy is mostly for non-react applications. However, when starting a new project most developers first create relative big components with more HTML. Later in the project components are created and the balance HTML / custom components shifts towards more custom components.

In these situations (starting a project and non-react projects) visual appearance based on state in CSS is a must. We allow it, but only with certain restrictions. First an example:

```css
.Abc {
  &.isOpen {
    & > * > .AbcItem {
         ^^^
      color: red;
      ^^^^^
    }
  }
}
```

We have highlighted two exceptions to the other policies:

- `>` - Here we are using another level of nesting. We are actually reaching further than we normally would.
- `color` - Here we are using a non-layout related property. We normally try to prevent that because we do not want to accidentally create unexpected situations.

Let's take another look at the example:

```css
.Abc {
^^^^
  &.isOpen {
   ^^^^^^^
    & > * > .AbcItem {
            ^^^^^^^^
      color: red;
    }
  }
}
```

We have highlighted the important parts that enable us to use this pattern without causing any linting errors:

- `.Abc` - This is the class name of the root selector.
- `.isOpen` - This indicates we are working on state, we accept the following as state selectors:
  - Classes that start with `is`: `.is-x`, `.isX`
  - Certain pseudo classes: `:hover`, `:active`, ...
  - Attribute selectors: `[data-x='true']`, `[aria-hidden='false']`
- `.AbcItem` - This is the selector that indicates this is part of `.Abc`, note that it should have the root name as a prefix.

Questions:
- Why do you require the prefix on the selector?
  - We want to make sure that both in the HTML and in the CSS it is clear that these things belong together. When you want to extract components things might break.
- Why only direct child (`>`) combinators, and not the ` ` combinator?
  - We want to prevent overreaching and creating problems when nesting components.

When you are working in React you probably won't need this strategy. In any case try to make sure you only apply styles that are state related.

### Examples

Examples of *correct* code for this rule:

```css
.good {
  &.isX {
    & > .goodX {
      ...
    }
  }
}
```
```css
.good {
  &[x] {
    & > .goodX {
      ...
    }
  }
}
```
```css
.good {
  &.isX {
    & > * > * > .goodX {
      ...
    }
  }
}
```
```css
.good {
  &[x] {
    & > * > .goodX {
      ...
    }
  }
}
```
```css
.good {
  &:hover {
    & > * > .goodX {
      ...
    }
  }
}
```
```css
.good {
  &.is-x {
    & > * > .goodX {
      ...
    }
  }
}
```

Examples of *incorrect* code for this rule:

```css
.component {
  &.isX {
    & > .componentX {
      color: 0;
    }
  }
}
```
```
.component {
  &.isX {
    & > * > .componentX {
      ...
    }
  }
}
```
