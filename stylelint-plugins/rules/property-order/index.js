import defineRule from '../../machinery/defineRule.js'
import docsUrl from '../../machinery/docsUrl.js'
import { propertyOrder } from './property-order.js'

// First occurrence wins on the off-chance a prop appears in two groups.
const orderIndex = propertyOrder.reduce(
  (map, prop, i) => (map.has(prop) ? map : map.set(prop, i)),
  new Map()
)

export const messages = {
  'wrong order': (prop, before) =>
    `Expected \`${prop}\` to come before \`${before}\``,
}

export default defineRule({
  ruleName: 'property-order',
  meta: {
    description: 'Declarations must follow the clean-order property order (known props only, no blank lines between groups)',
    url: docsUrl(import.meta.dirname),
    fixable: true,
  },
  ruleInteraction: null,
  messages,
  create() {
    return ({ originalRoot, modifiedRoot, report, context }) => {
      if (context.fix) reorderKnownDecls(originalRoot)
      else reportOutOfOrder(modifiedRoot, report)
    }
  }
})

function reportOutOfOrder(root, report) {
  root.walkRules(rule => {
    const seen = [] // known decls seen so far in source order: { prop, index }
    rule.each(node => {
      if (node.type !== 'decl') return
      const index = orderIndex.get(node.prop)
      if (index === undefined) return // ignore unknown props
      const before = seen.find(s => s.index > index)
      if (before) report(node, messages['wrong order'](node.prop, before.prop))
      seen.push({ prop: node.prop, index })
    })
  })
}

function reorderKnownDecls(root) {
  root.walkRules(rule => {
    const known = [] // known decl nodes in source order (the slots we may rewrite)
    rule.each(node => {
      if (node.type === 'decl' && orderIndex.has(node.prop)) known.push(node)
    })
    if (known.length < 2) return

    const sorted = [...known].sort((a, b) => orderIndex.get(a.prop) - orderIndex.get(b.prop))
    // ponytail: content-swap, not node-move — preserves indentation/blank-lines/comments without
    //           reattaching raws. Ceiling: a comment glued ABOVE a decl stays put (rare); upgrade to
    //           true node reordering only if that bites.
    const contents = sorted.map(captureContent) // capture before any write
    known.forEach((slot, i) => applyContent(slot, contents[i]))
  })
}

function captureContent(decl) {
  return {
    prop: decl.prop,
    value: decl.value,
    important: decl.important,
    raws: {
      between: decl.raws.between,
      value: decl.raws.value,
      important: decl.raws.important,
    },
  }
}

function applyContent(decl, content) {
  decl.prop = content.prop
  decl.value = content.value
  decl.important = content.important
  decl.raws.between = content.raws.between
  decl.raws.value = content.raws.value
  decl.raws.important = content.raws.important
}
