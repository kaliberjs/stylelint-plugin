import {
  parseSelector,
  withNestedRules,
  getRootRules,
} from '../../machinery/ast.js'
import defineRule from '../../machinery/defineRule.js'
import docsUrl from '../../machinery/docsUrl.js'

const pseudoStates = [
  ':hover', ':active', ':focus', ':focus-within',
  ':enabled', ':disabled', ':checked',
  ':empty', ':valid', ':invalid', ':in-range', ':out-of-range',
]

export const messages = {
  'nested - no component class name in nested': className =>
    `illegal class name\n` +
    `\`${className}\` can not be used in nested selectors - ` +
    `remove \`component\` from the name`,
  'property lower case': (actual, expected) =>
    `Expected '${actual}' to be '${expected}'`,
  'no _root child selectors':
    `Unexpected _root selector\n` +
    `_root or component_root selectors can not be used as a child selector - ` +
    `remove the _root or component_root prefix`,
}

export default defineRule({
  ruleName: 'naming-policy',
  meta: {
    description: 'Enforce naming conventions for selectors, values, properties, and exports',
    url: docsUrl(import.meta.dirname),
    fixable: true,
  },
  ruleInteraction: {
    'layout-related-properties': {
      rootAllowRule: is_root,
      childAllowRule: rule =>
        hasStateSelectorInParent(rule) &&
        rootNameIsNotComponent(rule) &&
        selectorNameHasRootNameAsPrefix(rule)
      },
      'selector-policy': {
        doubleSelectorsAllowRule: rule =>
          hasStateSelectorInParent(rule) &&
          rootNameIsNotComponent(rule) &&
          selectorNameHasRootNameAsPrefix(rule)
    },
  },
  cssRequirements: null,
  messages,
  create(config) {
    return ({ originalRoot, modifiedRoot, report, context }) => {
      noComponentNameInNested({ modifiedRoot, report })
      propertyLowerCase({ originalRoot, report, context })
      noRootInChildSelector({ modifiedRoot, report })
    }
  }
})

function noComponentNameInNested({ modifiedRoot, report }) {
  withNestedRules(modifiedRoot, (rule, parent) => {
    parseSelector(rule).walkClasses(x => {
      const className = x.value
      if (className.startsWith('component'))
        report(rule, messages['nested - no component class name in nested'](className), x.sourceIndex)
    })
  })
}


function propertyLowerCase({ originalRoot, report, context }) {
  originalRoot.walkDecls(decl => {
    const { prop, parent } = decl

    if (prop.startsWith('--')) return

    const expectedProp = prop.toLowerCase()

    if (prop === expectedProp) return
    if (context.fix) {
      decl.prop = expectedProp
      return
    }

    report(decl, messages['property lower case'](prop, expectedProp))
  })
}


function noRootInChildSelector({ modifiedRoot, report }) {
  withNestedRules(modifiedRoot, (rule, parent) => {
    const selectors = parseSelector(rule)
    selectors.each(selector => {
      const [first, second] = selector.filter(x =>
        (x.type === 'combinator' && x.value === ' ') ||
        (x.type === 'class' && (x.value.startsWith('_root') || x.value.startsWith('component_root')))
      )
      const rootSelector =
        first && first.type === 'class' ? first :
        second && second.type === 'class' ? second :
        null

      if (!rootSelector) return
      if (first.type === 'combinator') return

      report(rule, messages['no _root child selectors'], rootSelector.sourceIndex)
    })
  })
}

function is_root(rule) {
  return rule.selector.startsWith('._root') || rule.selector.startsWith('.component_root')
}

function hasStateSelectorInParent(rule) {
  const rootRules = getRootRules(rule)
  return rootRules.reverse().some(hasStateSelector)
}

function rootNameIsNotComponent(rule) {
  const rootName = getRootName(rule)
  return rootName && !rootName.startsWith('component')
}

function selectorNameHasRootNameAsPrefix(rule) {
  const rootName = getRootName(rule)
  if (!rootName) return
  return parseSelector(rule).every(selector => {
    const { type, value } = selector.last
    return type === 'class' && value.startsWith(rootName)
  })
}

function getRootName(rule) {
  const [rootRule] = getRootRules(rule)
  const rootName = parseSelector(rootRule).reduce(
    (result, selector) => {
      const { type, value } = selector.first
      const className = type === 'class' && value
      return result === null
        ? value
        : className === result && result
    },
    null
  )
  return rootName
}

function hasStateSelector(rule) {
  const selectors = parseSelector(rule)
  return selectors.every(isStateSelector)
}

function isStateSelector(selector) {
  const [first, second] = selector.nodes
  return first.type === 'nesting' && second && (
    isClassState(second) ||
    isPseudoClassState(second) ||
    isAttributeState(second)
  )
}

function isClassState({ type, value }) {
  return type === 'class' && /(^is-[a-z]|is[A-Z])/.test(value)
}

function isPseudoClassState(node) {
  const { type, value } = node
  return type === 'pseudo' && pseudoStates.includes(value)
}

function isAttributeState({ type }) {
  return type === 'attribute'
}
