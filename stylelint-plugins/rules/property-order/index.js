import defineRule from '../../machinery/defineRule.js'
import docsUrl from '../../machinery/docsUrl.js'
import { propertyOrder } from './property-order.js'

const orderIndex = propertyOrder.reduce(
  (map, prop, i) => (map.has(prop) ? map : map.set(prop, i)),
  new Map()
)


const familyAliases = new Map([
  ['top', 'inset'], ['right', 'inset'], ['bottom', 'inset'], ['left', 'inset'],
  ['row-gap', 'gap'], ['column-gap', 'gap'],
  ['align-content', 'place'], ['align-items', 'place'], ['align-self', 'place'],
  ['justify-content', 'place'], ['justify-items', 'place'], ['justify-self', 'place'],
  ['place-content', 'place'], ['place-items', 'place'], ['place-self', 'place'],
  ['columns', 'column'], ['column-count', 'column'], ['column-width', 'column'],
  ['line-height', 'font'],
])

function familyKey(prop) {
  return familyAliases.get(prop) ?? prop.split('-')[0]
}

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
    const seen = []
    rule.each(node => {
      if (node.type !== 'decl') return
      const index = orderIndex.get(node.prop)
      if (index === undefined) return
      const higher = seen.filter(s => s.index > index)
      // Only flag inversions the fix will actually resolve, i.e. across families (safe to reorder).
      // A same-family inversion is a shorthand/longhand override we deliberately leave in place — it's
      // surfaced (as a yellow warning) by declaration-block-no-shorthand-property-overrides instead.
      const sameFamily = higher.some(s => familyKey(s.prop) === familyKey(node.prop))
      const crossFamily = higher.find(s => familyKey(s.prop) !== familyKey(node.prop))
      if (crossFamily && !sameFamily) report(node, messages['wrong order'](node.prop, crossFamily.prop))
      seen.push({ prop: node.prop, index })
    })
  })
}

function reorderKnownDecls(root) {
  root.walkRules(rule => {
    const known = []
    rule.each(node => {
      if (node.type === 'decl' && orderIndex.has(node.prop)) known.push(node)
    })
    if (known.length < 2) return
    if (known.some(d => d.prop === 'all')) return

    /*
      Surgical sort. familyRank = the smallest canonical index among a family's members present here.
      Sorting by (familyRank, sourceIndex) drops each family at its canonical spot while the stable
      secondary key keeps that family's own members in source order — so a shorthand is never hoisted
      across a longhand it overrides (which would silently flip the cascade). Unrelated props still sort.
      Any preserved override stays visible to declaration-block-no-shorthand-property-overrides, so
      nothing is masked; sibling longhands (e.g. margin-top/left) are conservatively left in place too.
    */
    const familyRank = new Map()
    for (const d of known) {
      const f = familyKey(d.prop), idx = orderIndex.get(d.prop)
      if (!familyRank.has(f) || idx < familyRank.get(f)) familyRank.set(f, idx)
    }
    const sorted = known
      .map((d, i) => ({ d, i }))
      .sort((a, b) =>
        (familyRank.get(familyKey(a.d.prop)) - familyRank.get(familyKey(b.d.prop))) || (a.i - b.i)
      )
      .map(x => x.d)

    const contents = sorted.map(captureContent)
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
