import { parseSelector } from '../../machinery/ast.js'
import { isFile } from '../../machinery/filename.js'
import defineRule from '../../machinery/defineRule.js'
import docsUrl from '../../machinery/docsUrl.js'

export const messages = {
  'no class selectors': selector =>
    `Unexpected class selector '${selector}', only tag selectors are allowed in index.css - ` +
      `move the selector to another file or wrap it in \`:global(...)\``,
  'only import font':
    `Invalid @import value, you can only import fonts`,
  'only scope custom element':
    `Invalid @kaliber-scoped, you can only scope using custom elements`
}

export default defineRule({
  ruleName: 'index',
  meta: {
    description: 'Only tag selectors allowed in index.css — no class selectors',
    url: docsUrl(import.meta.dirname),
  },
  ruleInteraction: {
    'selector-policy': {
      tagSelectorsAllowCss: isIndex,
    },
    'at-rule-restrictions': {
      allowSpecificImport: rule => isIndex(rule.root()) && (
        rule.params.includes('font') ||
        messages['only import font']
      ),
      allowSpecificKaliberScoped: rule => isIndex(rule.root()) && (
        /[a-z]+(-[a-z]+)+/.test(rule.params) ||
        messages['only scope custom element']
      ),
    },
  },
  messages,
  create(config) {
    return ({ originalRoot, modifiedRoot, report, context }) => {
      onlyTagSelectorsInIndex({ root: modifiedRoot, report })
    }
  }
})

function onlyTagSelectorsInIndex({ root, report }) {
  if (!isIndex(root)) return
  root.walkRules(rule => {
    const selectors = parseSelector(rule)
    selectors.each(selector => {
      const [classNode] = selector.filter(x => x.type === 'class')
      if (!classNode) return
      report(rule, messages['no class selectors'](classNode.value), classNode.sourceIndex + 1)
    })
  })
}

function isIndex(root) { return isFile(root, 'index.css') }
