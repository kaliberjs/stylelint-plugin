const requiredFields = ['ruleName', 'meta', 'messages', 'create']

/** @type {import('./defineRule.d.ts').default} */
export default function defineRule(rule) {
  const missing = requiredFields.filter(f => !(f in rule))
  if (missing.length) throw new Error(`Rule '${rule.ruleName || '?'}' is missing: ${missing.join(', ')}`)

  return rule
}
