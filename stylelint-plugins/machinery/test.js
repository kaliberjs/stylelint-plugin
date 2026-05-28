import assert from 'node:assert'
import stylelint from 'stylelint'
import { describe, it } from 'node:test'
import { fileURLToPath } from 'node:url'

export { test }

function test(ruleName, tests) {
  Object.entries(tests).forEach(([ruleNameToTest, { valid, invalid }]) => {
    describe(ruleName === ruleNameToTest ? ruleName : `${ruleName} -> ${ruleNameToTest}`, () => {
      describe('valid', () => {
        valid.forEach(test => {
          it(test.title || test.code, async () => {
            await runTest(ruleNameToTest, test)
          })
        })
      })

      describe('invalid', () => {
        invalid.forEach(test => {
          it(test.title || test.code, async () => {
            await runTest(ruleNameToTest, { ...test, warnings: test.warnings || ['- no warnings specified -'] })
          })
        })
      })
    })
  })
}

async function runTest(ruleName, test) {
  const results = await stylelint.lint({
    code: test.code,
    codeFilename: test.filename,
    formatter: x => '', // When it fixes stuff, this function is not called (the new CSS is the output). If there are errors, the output contains the result of this function.
    config: {
      plugins: [fileURLToPath(new URL('../kaliber.js', import.meta.url))],
      rules: {
        [`kaliber/${ruleName}`]: [true]
      }
    },
    fix: Boolean(test.output)
  })
  const warnings = results.results.reduce((array, result) => array.concat(result.warnings), [])

  if (typeof test.warnings === 'number') {
    assert.equal(warnings.length, test.warnings, `Expected ${test.warnings} warnings, received ${warnings.length} warnings`)
  } else {
    // Stylelint 16 appends rule name to warnings, e.g. "(kaliber/rule-name)" - strip it for comparison
    const warningTexts = warnings.map(x => x.text.replace(/\s*\(kaliber\/[^)]+\)$/, ''))
    assert.deepEqual(warningTexts, test.warnings || [], 'warnings')
  }

  assert.equal(results.code ?? '', test.output || '')
}
