import assert from 'node:assert'
import { describe, it } from 'node:test'
import { createRequire } from 'node:module'
import { pathToFileURL } from 'node:url'
import { messages, familyKey } from './index.js'
import { test } from '../../machinery/test.js'

/*
  Completeness guarantee. The surgical fix must never reorder a shorthand across one of its longhands,
  which means familyKey MUST place every shorthand and its longhands in the same family. Rather than
  trust the hand-written familyAliases map, we verify it against stylelint's own authoritative graph
  (the exact data declaration-block-no-shorthand-property-overrides uses). If a stylelint upgrade adds
  or changes a shorthand our map doesn't cover, this test fails loudly — that's how we know it's complete.
*/
describe('property-order: familyKey covers stylelint\'s whole shorthand graph', () => {
  it('groups every shorthand with all its longhands (no cascade pair can be split)', async () => {
    const require = createRequire(import.meta.url)
    const ref = new URL('./reference/properties.mjs', pathToFileURL(require.resolve('stylelint')))
    const { longhandSubPropertiesOfShorthandProperties: graph } = await import(ref)

    const split = []
    for (const [shorthand, longhands] of graph)
      for (const longhand of longhands)
        if (familyKey(shorthand) !== familyKey(longhand)) split.push(`${shorthand} / ${longhand}`)

    assert.deepEqual(split, [],
      'shorthand/longhand pairs land in different families — add them to familyAliases in index.js')
  })
})

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
      {
        title: 'fix - an own-line comment travels with its property',
        code: `a {\n  display: block;\n  /* keep with z-index */\n  z-index: 0;\n}`,
        output: `a {\n  /* keep with z-index */\n  z-index: 0;\n  display: block;\n}`,
      },
      {
        title: 'fix - stylelint-disable-next-line stays glued to its target',
        code: `a {\n  /* stylelint-disable-next-line kaliber/layout-related-properties */\n  max-width: 100%;\n  display: block;\n}`,
        output: `a {\n  display: block;\n  /* stylelint-disable-next-line kaliber/layout-related-properties */\n  max-width: 100%;\n}`,
      },
      {
        title: 'fix - multiple leading comments all travel together',
        code: `a {\n  display: block;\n  /* one */\n  /* two */\n  z-index: 0;\n}`,
        output: `a {\n  /* one */\n  /* two */\n  z-index: 0;\n  display: block;\n}`,
      },
      {
        title: 'fix - a same-line trailing comment stays with its own property',
        code: `a {\n  display: block; /* trailing */\n  z-index: 0;\n}`,
        output: `a {\n  z-index: 0;\n  display: block; /* trailing */\n}`,
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
