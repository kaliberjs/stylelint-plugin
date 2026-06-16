import { messages } from './index.js'
import { test } from '../../machinery/test.js'

test('property-order', {
  'property-order': {
    valid: [
      {
        title: 'valid - already in order',
        code: `a {\n  display: block;\n  color: red;\n}`,
      },
      {
        title: 'valid - only unknown props are left alone',
        code: `a {\n  --custom: 1;\n  -webkit-foo: bar;\n}`,
      },
      {
        title: 'valid - known props in order, unknown interleaved',
        code: `a {\n  display: block;\n  --custom: 1;\n  color: red;\n}`,
      },
      {
        title: 'valid - unknown prop "out of order" is ignored',
        code: `a {\n  color: red;\n  --custom: 1;\n}`,
      },
      {
        title: 'fix - reorder out-of-order known props',
        code: `a {\n  color: red;\n  display: block;\n}`,
        output: `a {\n  display: block;\n  color: red;\n}`,
      },
      {
        title: 'fix - unknown props keep their slot, known props sorted around them',
        code: `a {\n  color: red;\n  --custom: 1;\n  display: block;\n}`,
        output: `a {\n  display: block;\n  --custom: 1;\n  color: red;\n}`,
      },
      {
        title: 'fix - preserves !important',
        code: `a {\n  color: red !important;\n  display: block;\n}`,
        output: `a {\n  display: block;\n  color: red !important;\n}`,
      },
    ],
    invalid: [
      {
        title: 'invalid - out of order known props',
        code: `a {\n  color: red;\n  display: block;\n}`,
        warnings: [messages['wrong order']('display', 'color')],
      },
      {
        title: 'invalid - reported in nested rule',
        code: `a {\n  & b {\n    color: red;\n    display: block;\n  }\n}`,
        warnings: [messages['wrong order']('display', 'color')],
      },
    ]
  }
})
