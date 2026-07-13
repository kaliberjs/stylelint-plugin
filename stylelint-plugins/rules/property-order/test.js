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
      {
        title: 'fix - surgical: shorthand/longhand override is NOT reordered (kept for the override warning)',
        code: `a {\n  padding-bottom: 0;\n  padding: 1rem;\n}`,
        output: `a {\n  padding-bottom: 0;\n  padding: 1rem;\n}`,
      },
      {
        title: 'fix - surgical: unrelated props sort AROUND a preserved override pair',
        code: `a {\n  padding-bottom: 0;\n  color: red;\n  padding: 1rem;\n}`,
        output: `a {\n  padding-bottom: 0;\n  padding: 1rem;\n  color: red;\n}`,
      },
      {
        title: 'fix - surgical: cross-family shorthand (inset/left) is also preserved',
        code: `a {\n  left: 0;\n  inset: 10px;\n}`,
        output: `a {\n  left: 0;\n  inset: 10px;\n}`,
      },
      {
        title: 'fix - surgical: sibling longhands are conservatively left in place',
        code: `a {\n  padding-left: 0;\n  padding-top: 1rem;\n}`,
        output: `a {\n  padding-left: 0;\n  padding-top: 1rem;\n}`,
      },
      {
        title: 'valid - a same-family override is not reported by us (declaration-block-no-shorthand-property-overrides owns it)',
        code: `a {\n  padding-bottom: 0;\n  padding: 1rem;\n}`,
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
      {
        title: 'invalid - cross-family inversions reported; the same-family override stays silent (owned by the core rule)',
        code: `a {\n  color: red;\n  padding-bottom: 0;\n  padding: 1rem;\n}`,
        warnings: [messages['wrong order']('padding-bottom', 'color')],
      },
    ]
  }
})
