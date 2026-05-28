import stylelint from 'stylelint'
import postcss from 'postcss'
import postcssModulesValues from 'postcss-modules-values'
import postcssCustomProperties from 'postcss-custom-properties'
import postcssCustomMedia from 'postcss-custom-media'
import postcssCustomSelectors from 'postcss-custom-selectors'
import postcssCalc from 'postcss-calc'
import { getNormalizedRoots } from './machinery/ast.js'
import colorSchemes from './rules/color-schemes/index.js'
import cssGlobal from './rules/css-global/index.js'
import layoutRelatedProperties from './rules/layout-related-properties/index.js'
import namingPolicy from './rules/naming-policy/index.js'
import selectorPolicy from './rules/selector-policy/index.js'
import parentChildPolicy from './rules/parent-child-policy/index.js'
import rootPolicy from './rules/root-policy/index.js'
import atRuleRestrictions from './rules/at-rule-restrictions/index.js'
import indexRule from './rules/index/index.js'
import reset from './rules/reset/index.js'

/*
  Motivation

  Without these (and some eslint) rules html and css will be tied together in a way
  that prevents reuse. Every html element in the code is a potential component, without
  these rules it becomes quite tricky to turn a select set of tags into a component. The
  css often ties it together in a way that makes it quite hard to extract the correct parts
  for the component. This results in people copy/pasting large sections and adjusting them
  to their needs.
*/

const rules = toStyleLintPlugins(
  colorSchemes,
  cssGlobal,
  layoutRelatedProperties,
  namingPolicy,
  selectorPolicy,
  parentChildPolicy,
  rootPolicy,
  atRuleRestrictions,
  indexRule,
  reset,
)
export default rules

function toStyleLintPlugins(...rules) {
  const ruleInteraction = determineRuleInteraction(rules)
  const ruleConfiguration = convertToConfiguration(ruleInteraction)

  return rules.map(({ ruleName, cssRequirements, create }) =>
    createPlugin({
      ...(cssRequirements || {}),
      ruleName: `kaliber/${ruleName}`,
      plugin: create(ruleConfiguration[ruleName] || {}),
    })
  )
}

function determineRuleInteraction(rules) {
  /*
    [{ ruleInteraction: { ruleA: { b: c } } }, { ruleInteraction: { ruleA: { c: d } } }, ...]

    to

    { ruleA: [{ b: c }, { c: d }], ... }
  */
  return rules.reduce(
    (result, rule) => ({
      ...result,
      ...Object.entries(rule.ruleInteraction || {}).reduce(
        (result, [rule, config]) => ({
          ...result,
          [rule]: [...(result[rule] || []), config]
        }),
        result
      )
    }),
    {}
  )
}

function convertToConfiguration(ruleInteraction) {
  /*
    { ruleA: [{ a: b }, { a: c }, { b: d }], ... }

    to

    { ruleA" { a: b or c, b: d }, ... }
  */
  return Object.entries(ruleInteraction).reduce(
    (result, [rule, configs]) => ({ ...result, [rule]: merge(configs) }),
    {}
  )

  function merge(configs) {
    return configs.reduce(
      (result, config) => Object.entries(config).reduce(
        (result, [key, value]) => {
          if (typeof value !== 'function') throw new Error(`don't know how to handle config value`)
          const existing = result[key]
          return { ...result, [key]: existing ? x => existing(x) || value(x) : value }
        },
        result
      ),
      {}
    )
  }
}

function createPlugin({
  ruleName, plugin,
  normalizedCss = false,
  resolvedCustomProperties = false,
  resolvedCustomMedia = false,
  resolvedCustomSelectors = false,
  resolvedModuleValues = false,
  resolvedCalc = false,
}) {
  const stylelintPlugin = stylelint.createPlugin(ruleName, pluginWrapper)

  return stylelintPlugin

  function pluginWrapper(primaryOption, secondaryOptionObject, context) {
    return async (originalRoot, result) => {
      const check = { actual: primaryOption, possible: [true] }
      if (!stylelint.utils.validateOptions(result, ruleName, check)) return

      const reported = {}

      const modifiedRoot = originalRoot.clone()
      
      // Build a list of PostCSS plugins to run
      const plugins = []
      
      if (resolvedModuleValues) {
        plugins.push(postcssModulesValues())
      }
      
      if (resolvedCustomProperties) {
        plugins.push(postcssCustomProperties({ preserve: false }))
      }
      if (resolvedCustomMedia) {
        plugins.push(postcssCustomMedia({ preserve: false }))
      }
      if (resolvedCustomSelectors) {
        plugins.push(postcssCustomSelectors({ preserve: false }))
      }
      
      if (resolvedCalc) {
        plugins.push(postcssCalc())
      }

      let processedRoot = modifiedRoot
      
      // Run the PostCSS plugins on the modified root
      if (plugins.length > 0) {
        const processor = postcss(plugins)
        const processResult = await processor.process(modifiedRoot, { from: undefined })
        processedRoot = processResult.root
      }
      
      callPlugin(processedRoot)

      /*
        This implementation splits it for each plugin. This might be a performance problem. The easy
        solution would be to create a `kaliber/style-lint` plugin/rule. That rule would be the only
        rule that is configured in .stylelintrc. It would split the root once and then run the
        different rules manually (stylelint.rules['kaliber/xyz'](...)(splitRoot, result)).
      */
      if (normalizedCss)
        Object.entries(getNormalizedRoots(processedRoot)).forEach(([mediaQuery, normalizedRoot]) => {
          callPlugin(normalizedRoot)
        })

      function callPlugin(modifiedRoot) {
        plugin({ modifiedRoot, originalRoot, report, context })
      }

      function report(node, message, index) {
        const id = getId(node, message, index)
        if (reported[id]) return
        reported[id] = true

        if (!node.source) {
          stylelint.utils.report({
            message: `A generated node (${getNodeId(node)}) caused a problem\n  ${node.toString().split('\n').join('\n  ')}\n${message}`,
            node: node.parent,
            result,
            ruleName,
          })
          return
        }

        const reportLocation = getReportLocation(node, index)
        stylelint.utils.report({
          message,
          node,
          result,
          ruleName,
          ...reportLocation,
        })
      }
    }
  }
}

function getReportLocation(node, index) {
  const startOffset = node.source?.start?.offset
  const endOffset = node.source?.end?.offset
  const preferredIndex = Number.isInteger(index) ? index : startOffset
  const preferredEndIndex = endOffset ?? (Number.isInteger(preferredIndex) ? preferredIndex + node.toString().length : undefined)

  return preferredIndex != null && preferredEndIndex != null
    ? { index: preferredIndex, endIndex: preferredEndIndex }
    : {}
}

function getId(node, message, index) {
  return `${getNodeId(node)}-${message}${index}`
}

function getNodeId({ type, prop, selector, name, params, parent }) {
  const nodeId =
    type === 'decl' ? `decl-${prop}` :
    type === 'rule' ? `rule-${selector}` :
    type === 'atrule' ? `atrule-${name}-${params}` :
    type

  const parentId = parent
    ? `${getNodeId(parent)}-`
    : ''

  return `${parentId}${nodeId}`
}
