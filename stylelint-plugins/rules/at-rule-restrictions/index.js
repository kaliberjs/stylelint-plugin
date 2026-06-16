import { matchesFile } from '../../machinery/filename.js'
import defineRule from '../../machinery/defineRule.js'
import docsUrl from '../../machinery/docsUrl.js'

export const messages = {
  'no import':
    `Unexpected @import\n` +
    `you can only use @import in \`*.entry.css\` files or in \`index.css\` files - ` +
    `you might not need the import, for custom variables use custom properties in \`src/cssGlobal/\`\n` +
    `in other cases try another method of reuse, for example create another class`,
}

export default defineRule({
  ruleName: 'at-rule-restrictions',
  meta: {
    description: 'Restrict @import to entry files',
    url: docsUrl(import.meta.dirname),
  },
  ruleInteraction: null,
  messages,
  create({ allowSpecificImport }) {
    const allowImport = isEntryCss

    return ({ originalRoot, modifiedRoot, report, context }) => {
      noImport({ root: modifiedRoot, report, allowImport, allowSpecificImport })
    }
  }
})

function noImport({ root, report, allowImport, allowSpecificImport }) {
  if (allowImport && allowImport(root)) return
  root.walkAtRules('import', rule => {
    const specific = allowSpecificImport && allowSpecificImport(rule)
    if (specific) {
      if (typeof specific !== 'string') return
      report(rule, specific)
    } else {
      report(rule, messages['no import'])
    }
  })
}


function isEntryCss(root) { return matchesFile(root, filename => filename.endsWith('.entry.css')) }
