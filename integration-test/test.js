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
  'at-rule-empty-line-before',
  'at-rule-no-unknown',
  '@stylistic/at-rule-name-case',
  '@stylistic/at-rule-name-space-after',
  '@stylistic/at-rule-semicolon-newline-after',
  '@stylistic/block-closing-brace-empty-line-before',
  '@stylistic/block-closing-brace-newline-after',
  '@stylistic/block-closing-brace-newline-before',
  '@stylistic/block-closing-brace-space-before',
  'block-no-empty',
  '@stylistic/block-opening-brace-newline-after',
  '@stylistic/block-opening-brace-space-after',
  '@stylistic/block-opening-brace-space-before',
  '@stylistic/color-hex-case',
  'color-hex-length',
  'color-no-invalid-hex',
  'comment-empty-line-before',
  'comment-no-empty',
  'comment-whitespace-inside',
  // 'custom-property-empty-line-before', // rule disabled
  '@stylistic/declaration-bang-space-after',
  '@stylistic/declaration-bang-space-before',
  'declaration-block-no-duplicate-properties',
  'declaration-block-no-shorthand-property-overrides',
  '@stylistic/declaration-block-semicolon-newline-after',
  '@stylistic/declaration-block-semicolon-space-after',
  '@stylistic/declaration-block-semicolon-space-before',
  'declaration-block-single-line-max-declarations',
  '@stylistic/declaration-block-trailing-semicolon',
  '@stylistic/declaration-colon-space-after',
  '@stylistic/declaration-colon-space-before',
  'declaration-empty-line-before',
  'font-family-no-duplicate-names',
  '@stylistic/function-comma-newline-after',
  '@stylistic/function-comma-space-after',
  '@stylistic/function-comma-space-before',
  'function-linear-gradient-no-nonstandard-direction',
  '@stylistic/function-max-empty-lines',
  'function-name-case',
  '@stylistic/function-parentheses-newline-inside',
  '@stylistic/function-parentheses-space-inside',
  '@stylistic/function-whitespace-after',
  '@stylistic/indentation',
  'keyframe-declaration-no-important',
  'length-zero-no-unit',
  '@stylistic/max-empty-lines',
  '@stylistic/media-feature-colon-space-after',
  '@stylistic/media-feature-colon-space-before',
  '@stylistic/media-feature-name-case',
  'media-feature-name-no-unknown',
  '@stylistic/media-feature-parentheses-space-inside',
  '@stylistic/media-feature-range-operator-space-after',
  '@stylistic/media-feature-range-operator-space-before',
  '@stylistic/media-query-list-comma-newline-after',
  '@stylistic/media-query-list-comma-space-after',
  '@stylistic/media-query-list-comma-space-before',
  // 'no-descending-specificity', // rule disabled
  'no-duplicate-at-import-rules',
  'no-duplicate-selectors',
  'no-empty-source',
  // '@stylistic/no-eol-whitespace', // is auto removed by my editor
  '@stylistic/no-extra-semicolons',
  'no-invalid-double-slash-comments',
  // '@stylistic/no-missing-end-of-source-newline', // is auto added by my editor
  '@stylistic/number-leading-zero',
  '@stylistic/number-no-trailing-zeros',
  // '@stylistic/property-case', // rule disabled
  'property-no-unknown',
  'rule-empty-line-before',
  '@stylistic/selector-attribute-brackets-space-inside',
  '@stylistic/selector-attribute-operator-space-after',
  '@stylistic/selector-attribute-operator-space-before',
  '@stylistic/selector-combinator-space-after',
  '@stylistic/selector-combinator-space-before',
  '@stylistic/selector-descendant-combinator-no-non-space',
  '@stylistic/selector-list-comma-newline-after',
  '@stylistic/selector-list-comma-space-before',
  '@stylistic/selector-max-empty-lines',
  '@stylistic/selector-pseudo-class-case',
  'selector-pseudo-class-no-unknown',
  '@stylistic/selector-pseudo-class-parentheses-space-inside',
  '@stylistic/selector-pseudo-element-case',
  'selector-pseudo-element-colon-notation',
  'selector-pseudo-element-no-unknown',
  'selector-type-case',
  'selector-type-no-unknown',
  'string-no-newline',
  '@stylistic/unit-case',
  // 'unit-no-unknown', // rule disabled (covered by unit-allowed-list)
  'unit-allowed-list',
  '@stylistic/value-list-comma-newline-after',
  '@stylistic/value-list-comma-space-after',
  '@stylistic/value-list-comma-space-before',
  '@stylistic/value-list-max-empty-lines',
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
  const result = spawnSync(
    `node ./node_modules/.bin/stylelint --formatter json ${files.join(' ')}`,
    { env, shell: true }
  )

  const raw = result.stdout.toString() || result.stderr.toString()
  let output
  try {
    output = JSON.parse(raw)
  } catch {
    throw new Error(`stylelint produced no valid JSON output.\nstdout: ${result.stdout.toString()}\nstderr: ${result.stderr.toString()}`)
  }

  const reportedProblems = new Set(
    output.flatMap(file => file.warnings.map(warning => warning.rule))
  )

  return reportedProblems
}
