import {
  withRootRules,
  isRoot,
  getRootRules,
} from '../../machinery/ast.js'
import { checkRuleRelation } from '../../machinery/relations.js'
import defineRule from '../../machinery/defineRule.js'
import docsUrl from '../../machinery/docsUrl.js'

export const messages = {
  'root - z-index without position relative':
    'missing `position: relative;`\n' +
    '`z-index` can only be used at the root level to create a non invasive stacking context - ' +
    'add `position: relative;` or set the `z-index` with a nested selector in another root rule',
  'root - z-index not 0':
    'not 0\n' +
    '`z-index` can only be used at the root level when creating a non invasive stacking context - ' +
    'set to 0 or set the `z-index` with a nested selector in another root rule',
}

const rootCombos = {
  validStackingContext: {
    rootHasOneOf: ['z-index'],
    require: [
      ['z-index', '0'],
      ['position', 'relative']
    ]
  },
}

export default defineRule({
  ruleName: 'root-policy',
  meta: {
    description: 'Root-level z-index must create a valid stacking context with position: relative',
    url: docsUrl(import.meta.dirname),
    fixable: true,
  },
  ruleInteraction: {
    'layout-related-properties': {
      rootAllowDecl: decl => decl.prop === 'z-index',
    },
  },
  cssRequirements: {
    normalizedCss: true,
  },
  messages,
  create(config) {
    return ({ originalRoot, modifiedRoot, report, context }) => {
      validStackingContextInRoot({ root: modifiedRoot, report, context })
    }
  }
})

function validStackingContextInRoot({ root, report, context }) {
  withRootRules(root, rule => {

    const result = checkRootCombo(rule, rootCombos.validStackingContext)

    result.forEach(({ result, prop, triggerDecl, invalidDecl, value, expectedValue }) => {
      if (prop === 'position') report(triggerDecl, messages['root - z-index without position relative'])
      if (prop === 'z-index') {
        if (context.fix) {
          invalidDecl.value = expectedValue
          return
        }
        report(triggerDecl, messages['root - z-index not 0'])
      }
    })
  })
}

function checkRootCombo(rootRule, { rootHasOneOf, require }) {
  if (!isRoot(rootRule)) throw new Error('You should not call this function with a non-root rule')

  return checkRuleRelation({
    rule: rootRule,
    triggerProperties: rootHasOneOf,
    rulesToCheck: getRootRules(rootRule),
    requiredProperties: require
  })
}
