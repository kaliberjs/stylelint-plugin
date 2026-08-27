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

export function familyKey(prop) {
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

    // Comments attached to a decl must travel with it: own-line comment(s) directly above (e.g. a
    // `stylelint-disable-next-line` MUST stay glued to its target), and a same-line trailing comment.
    // Capture ownership from the ORIGINAL positions before moving anything.
    const attached = new Map(known.map(d => [d, { lead: leadingComments(d), trail: trailingComments(d) }]))

    // Move content into the sorted slots (preserves indentation/blank-lines/raws of each slot)…
    const contents = sorted.map(captureContent)
    known.forEach((slot, i) => applyContent(slot, contents[i]))

    // …then relocate each moved decl's comments around the slot that now holds its content.
    known.forEach((slot, i) => {
      const source = sorted[i] // the decl whose content now lives in `slot`
      if (source === slot) return // content didn't move → its comments are already in place
      const { lead, trail } = attached.get(source)
      for (const comment of lead) { comment.remove(); slot.before(comment) }
      let anchor = slot
      for (const comment of trail) { comment.remove(); anchor.after(comment); anchor = comment }
    })
  })
}

// Own-line comments above a decl (newline in `before`) belong to it. A same-line trailing comment
// (no newline) belongs to the decl before it, so leadingComments stops at one.
function leadingComments(decl) {
  const comments = []
  let prev = decl.prev()
  while (prev && prev.type === 'comment' && (prev.raws.before || '').includes('\n')) {
    comments.unshift(prev)
    prev = prev.prev()
  }
  return comments
}

function trailingComments(decl) {
  const comments = []
  let next = decl.next()
  while (next && next.type === 'comment' && !(next.raws.before || '').includes('\n')) {
    comments.push(next)
    next = next.next()
  }
  return comments
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
