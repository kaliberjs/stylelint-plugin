const assert = require('node:assert')
const { spawnSync } = require('node:child_process')
const { describe, test } = require('node:test')

const problems = new Set([
  'csstools/use-nesting',
  'kaliber/color-schemes',
  'kaliber/css-global',
  'kaliber/index',
  'kaliber/layout-related-properties',
  'kaliber/naming-policy',
  'kaliber/at-rule-restrictions',
  'kaliber/parent-child-policy',
  'kaliber/reset',
  'kaliber/root-policy',
  'kaliber/selector-policy',
  'at-rule-disallowed-list',
  'at-rule-name-case',
  'at-rule-name-space-after',
  'at-rule-no-unknown',
  'at-rule-semicolon-newline-after',
  'block-closing-brace-empty-line-before',
  'block-closing-brace-newline-after',
  'block-closing-brace-newline-before',
  'block-closing-brace-space-before',
  'block-no-empty',
  'block-opening-brace-newline-after',
  'block-opening-brace-space-after',
  'block-opening-brace-space-before',
  'color-hex-case',
  'color-hex-length',
  'color-no-invalid-hex',
  'comment-empty-line-before',
  'comment-no-empty',
  'comment-whitespace-inside',
  // 'custom-property-empty-line-before', // rule disabled
  'declaration-bang-space-after',
  'declaration-bang-space-before',
  'declaration-block-no-shorthand-property-overrides',
  'declaration-block-semicolon-newline-after',
  'declaration-block-semicolon-space-after',
  'declaration-block-semicolon-space-before',
  'declaration-block-single-line-max-declarations',
  'declaration-block-trailing-semicolon',
  'declaration-colon-space-after',
  'declaration-colon-space-before',
  'declaration-empty-line-before',
  'font-family-no-duplicate-names',
  'function-comma-newline-after',
  'function-comma-space-after',
  'function-comma-space-before',
  'function-linear-gradient-no-nonstandard-direction',
  'function-max-empty-lines',
  'function-name-case',
  'function-parentheses-newline-inside',
  'function-parentheses-space-inside',
  'function-whitespace-after',
  'indentation',
  'keyframe-declaration-no-important',
  'length-zero-no-unit',
  'max-empty-lines',
  'media-feature-colon-space-after',
  'media-feature-colon-space-before',
  'media-feature-name-case',
  'media-feature-name-no-unknown',
  'media-feature-parentheses-space-inside',
  'media-feature-range-operator-space-after',
  'media-feature-range-operator-space-before',
  'media-query-list-comma-newline-after',
  'media-query-list-comma-space-after',
  'media-query-list-comma-space-before',
  // 'no-descending-specificity', // rule disabled
  'no-duplicate-at-import-rules',
  'no-duplicate-selectors',
  'no-empty-source',
  // 'no-eol-whitespace', // is auto removed by my editor
  'no-extra-semicolons',
  'no-invalid-double-slash-comments',
  // 'no-missing-end-of-source-newline', // is auto added by my editor
  'number-leading-zero',
  'number-no-trailing-zeros',
  // 'property-case', // rule disabled
  'property-no-unknown',
  'rule-empty-line-before',
  'selector-attribute-brackets-space-inside',
  'selector-attribute-operator-space-after',
  'selector-attribute-operator-space-before',
  'selector-combinator-space-after',
  'selector-combinator-space-before',
  'selector-descendant-combinator-no-non-space',
  'selector-list-comma-newline-after',
  'selector-list-comma-space-before',
  'selector-max-empty-lines',
  'selector-pseudo-class-case',
  'selector-pseudo-class-no-unknown',
  'selector-pseudo-class-parentheses-space-inside',
  'selector-pseudo-element-case',
  'selector-pseudo-element-colon-notation',
  'selector-pseudo-element-no-unknown',
  'selector-type-case',
  'selector-type-no-unknown',
  'string-no-newline',
  'unit-case',
  // 'unit-no-unknown', // rule disabled (covered by unit-whitelist)
  'unit-allowed-list',
  'value-list-comma-newline-after',
  'value-list-comma-space-after',
  'value-list-comma-space-before',
  'value-list-max-empty-lines',
])

describe('Integration test', () => {

  test('bad css', () => {
    const reportedProblems = styleLint([
      'integration-test/bad/*.css',
      'integration-test/bad/cssGlobal/*.css',
    ])

    const missingProblems = Array.from(problems.difference(reportedProblems))
    const unreportedProblems = Array.from(reportedProblems.difference(problems))
    assert.deepEqual(missingProblems, [], `Missing problems`)
    assert.deepEqual(unreportedProblems, [], `Unreported problems`)
  })

  test('good css', () => {
    const reportedProblems = styleLint([
      'integration-test/good/*.css',
      'integration-test/good/cssGlobal/*.css',
    ])

    assert.deepEqual(Array.from(reportedProblems), [], `Problems found`)
  })

})

function styleLint(files) {
  const { FORCE_COLOR, ...env } = process.env
  const result = spawnSync(`node ./node_modules/.bin/stylelint --no-color ${files.join(' ')}`, { env, shell: true })
  const resultString = result.stdout.toString()
  const results = resultString.split('\n')
    .filter(x => x.toLowerCase().includes('⚠'))
    .map(x => {
      const segments = x.split(/\s+/).filter(Boolean)
      const [lastSegment] = segments.slice(-1)
      return lastSegment
    })

  const reportedProblems = new Set(results)

  return reportedProblems
}
