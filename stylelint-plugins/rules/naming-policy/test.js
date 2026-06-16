import { messages } from './index.js'
import { messages as layoutRelatedPropertiesMessages } from '../layout-related-properties/index.js'
import { messages as selectorPolicyMessages } from '../selector-policy/index.js'
import { test } from '../../machinery/test.js'

test('naming-policy', {
  'naming-policy': {
    valid: [
      { code: '.componentGood { & > .test { } }' },
      { code: '.good { & > .test { } }' },
      { code: 'a { }' },
      { code: 'a { display: block; }' },
      { code: ':root { --custom-PropertyName: red; }' },
      {
        code: 'a { Display: block; }',
        output: 'a { display: block; }',
      },
      {
        code: ':root { customPropertyName: red; }',
        output: ':root { custompropertyname: red; }',
      },
      {
        title: 'fix multiple uppercase properties in one rule',
        code: 'a { Display: block; Color: red; }',
        output: 'a { display: block; color: red; }',
      },
      {
        title: 'fix uppercase property in nested rule',
        code: '.test { & > .child { Display: block; } }',
        output: '.test { & > .child { display: block; } }',
      },
      { code: `._rootGood { pointer-events: none; }` },
      { code: `.good { & ._root {} }` },
    ],
    invalid: [
      {
        code: '.bad { & > .componentTest { } }',
        warnings: [messages['nested - no component class name in nested']('componentTest')]
      },
      {
        title: '└─ take @media into account',
        code: '.bad { @media x { & > .componentTest { } } }',
        warnings: [messages['nested - no component class name in nested']('componentTest')]
      },
      {
        code: 'a { Display: block; }',
        warnings: [messages['property lower case']('Display', 'display')],
      },
      {
        code: ':root { customPropertyName: red; }',
        warnings: [messages['property lower case']('customPropertyName', 'custompropertyname')],
      },
      {
        code: `.bad { & > ._root { color: 0; } }`,
        warnings: [messages['no _root child selectors']]
      },
      {
        code: `.bad { $ > .test, & > ._root { color: 0; } }`,
        warnings: [messages['no _root child selectors']]
      },
      {
        code: `.bad { & > .component_root { color: 0; } }`,
        warnings: [
          messages['nested - no component class name in nested']('component_root'),
          messages['no _root child selectors'],
        ]
      },
    ]
  },
  'layout-related-properties': {
    valid: [
      {
        title: `don't report errors when layout related props are used in _root or component_root`,
        code: `
          ._rootTest {
            width: 100%; height: 100%;
            position: absolute;
            top: 0; right: 0; bottom: 0; left: 0;
            margin: 0; margin-top: 0; margin-right: 0; margin-bottom: 0; margin-left: 0;
            flex: 0; flex-grow: 0; flex-shrink: 0; flex-basis: 0;
            grid: 0; grid-area: 0; grid-column: 0; grid-row: 0;
            grid-column-start: 0; grid-column-end: 0; grid-row-start: 0; grid-row-end: 0;
            justify-self: 0; align-self: 0;
            order: 0;
          }

          .component_rootTest {
            width: 100%; height: 100%;
            position: absolute;
            top: 0; right: 0; bottom: 0; left: 0;
            margin: 0; margin-top: 0; margin-right: 0; margin-bottom: 0; margin-left: 0;
            flex: 0; flex-grow: 0; flex-shrink: 0; flex-basis: 0;
            grid: 0; grid-area: 0; grid-column: 0; grid-row: 0;
            grid-column-start: 0; grid-column-end: 0; grid-row-start: 0; grid-row-end: 0;
            justify-self: 0; align-self: 0;
            order: 0;
          }
        `,
      },
      { code: `.good { &.isX { & > .goodX { color: 0; } } }` },
      { code: `.good { &[x] { & > .goodX { color: 0; } } }` },
    ],
    invalid: [
      {
        code: `.component { &.isX { & > .componentX { color: 0; } } }`,
        warnings: [layoutRelatedPropertiesMessages['nested - only layout related props in nested']('color')]
      },
    ]
  },
  'selector-policy': {
    valid: [
      { code: `.good { &.isX { & > * > * > .goodX { color: 0; } } }` },
      { code: `.good { &[x] { & > * > .goodX { color: 0; } } }` },
      { code: `.good { &:hover { & > * > .goodX { color: 0; } } }` },
      { code: `.good { &.is-x { & > * > .goodX { color: 0; } } }` },
    ],
    invalid: [
      {
        code: `.component { &.isX { & > * > .componentX { color: 0; } } }`,
        warnings: [selectorPolicyMessages['nested - no double child selectors']]
      },
    ]
  }
})
