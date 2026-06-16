import { declMatches, parseSelector } from '../../machinery/ast.js'
import { isFile } from '../../machinery/filename.js'
import defineRule from '../../machinery/defineRule.js'
import docsUrl from '../../machinery/docsUrl.js'

const allowedInReset = [
  'width', 'height',
  'max-width', 'max-height',
  'margin', 'margin-top', 'margin-right', 'margin-bottom', 'margin-left',
]

export const messages = {
  'no class selectors': selector =>
    `Unexpected class selector '${selector}', only tag selectors are allowed in reset.css`,
}

export default defineRule({
  ruleName: 'reset',
  meta: {
    description: 'Only tag selectors allowed in reset.css — no class selectors',
    url: docsUrl(import.meta.dirname),
  },
  ruleInteraction: {
    'layout-related-properties': {
      rootAllowDecl: decl => isReset(decl.root()) && declMatches(decl, allowedInReset),
    },
    'selector-policy': {
      tagSelectorsAllowCss: isReset
    },
  },
  messages,
  create(config) {
    return ({ originalRoot, modifiedRoot, report, context }) => {
      onlyTagSelectorsInReset({ root: modifiedRoot, report })
    }
  }
})

function onlyTagSelectorsInReset({ root, report }) {
  if (!isReset(root)) return
  root.walkRules(rule => {
    const selectors = parseSelector(rule)
    selectors.each(selector => {
      let [classNode] = selector.filter(x => x.type === 'class')
      const [globalNode] = selector.filter(x => x.type === 'pseudo' && x.value === ':global')
      if (!classNode) {
        if (!globalNode) return
        [classNode] = globalNode.first.filter(x => x.type === 'class')
      }
      report(rule, messages['no class selectors'](classNode.value), classNode.sourceIndex + 1)
    })
  })
}

function isReset(root) { return isFile(root, 'reset.css') }
