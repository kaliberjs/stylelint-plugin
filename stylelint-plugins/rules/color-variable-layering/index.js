import { matchesFile } from '../../machinery/filename.js'
import { readCssGlobalFile } from '../../machinery/cssGlobal.js'
import defineRule from '../../machinery/defineRule.js'
import docsUrl from '../../machinery/docsUrl.js'

/**
 * Extracts all var(--*) references from a CSS value string.
 */
const varReferencePattern = /var\(\s*(--[a-zA-Z0-9-]+)/g

/**
 * Filenames to try when looking for context tokens inside cssGlobal/.
 * Some projects use singular, others plural.
 */
const contextFileNames = ['style-context.css', 'style-contexts.css']

export const messages = {
  'use context token': (token, suggestion) =>
    `Unexpected non-context color token "${token}"\n` +
    `components should use context-layer tokens from style-contexts.css` +
    (suggestion ? ` (e.g. var(${suggestion}))` : '') +
    `\nmove this to cssGlobal/ or style-contexts.css, or use a context token instead`
}

/**
 * Extracts custom property names from style-contexts.css content.
 * Only matches lines that look like `--token-name: ...;` declarations.
 *
 * @param {string} cssContent
 * @returns {Set<string>}
 */
function extractContextTokens(cssContent) {
  const tokens = new Set()
  const declPattern = /^\s*(--[a-zA-Z0-9-]+)\s*:/gm
  let match
  while ((match = declPattern.exec(cssContent)) !== null) {
    tokens.add(match[1])
  }
  return tokens
}

/** Parsed token cache — keyed by cssGlobal path */
const tokenCache = new Map()

/**
 * Seeds the token cache for testing — allows tests to provide context tokens
 * without needing a real style-contexts.css file on disk.
 *
 * @param {string[]} tokens - Array of context token names
 */
export function seedTokenCache(tokens) {
  tokenCache.set('__test__', new Set(tokens))
}

/**
 * Reads context tokens from the configured cssGlobal directory.
 * Tries both `style-context.css` and `style-contexts.css`.
 *
 * @param {string} cssGlobalPath
 * @returns {Set<string> | null}
 */
function getContextTokens(cssGlobalPath) {
  if (tokenCache.has(cssGlobalPath)) return tokenCache.get(cssGlobalPath)

  for (const filename of contextFileNames) {
    const content = readCssGlobalFile(cssGlobalPath, filename)
    if (content) {
      const tokens = extractContextTokens(content)
      tokenCache.set(cssGlobalPath, tokens)
      return tokens
    }
  }

  tokenCache.set(cssGlobalPath, null)
  return null
}

export default defineRule({
  ruleName: 'color-variable-layering',
  meta: {
    description: 'Enforce that component CSS only uses context-layer color tokens (not palette or semantic tokens)',
    url: docsUrl(import.meta.dirname),
  },
  ruleInteraction: null,
  cssRequirements: null,
  messages,
  create() {
    return ({ originalRoot, report, options }) => {
      // Skip infrastructure files — they can use any layer
      if (isInfraFile(originalRoot)) return

      // For test files (virtual paths), use the seeded test tokens
      if (tokenCache.has('__test__')) {
        checkDeclarations(originalRoot, tokenCache.get('__test__'), report)
        return
      }

      // Require cssGlobal option — the rule is a no-op without it
      const cssGlobal = options?.cssGlobal
      if (!cssGlobal) return

      const contextTokens = getContextTokens(cssGlobal)
      if (!contextTokens || contextTokens.size === 0) return

      checkDeclarations(originalRoot, contextTokens, report)
    }
  }
})

function checkDeclarations(root, contextTokens, report) {
  root.walkDecls(decl => {
    const { value, prop } = decl

    // Skip custom property definitions — they're creating tokens, not consuming them
    if (prop.startsWith('--')) return

    const matches = value.matchAll(varReferencePattern)
    for (const match of matches) {
      const tokenName = match[1]

      // Only check color-related tokens (starting with --color)
      if (!isColorToken(tokenName)) continue

      // If this isn't a known context token, flag it
      if (!contextTokens.has(tokenName)) {
        const suggestion = suggestContextToken(tokenName)
        report(decl, messages['use context token'](tokenName, suggestion))
      }
    }
  })
}

function isInfraFile(root) {
  return matchesFile(root, filename =>
    filename.includes('/cssGlobal/') ||
    filename.includes('style-contexts') ||
    /colorScheme.*\.css/.test(filename)
  )
}

function isColorToken(tokenName) {
  return tokenName.startsWith('--color')
}

/**
 * Suggest a likely context token replacement for common semantic/palette tokens.
 */
function suggestContextToken(tokenName) {
  if (/--color-primary/.test(tokenName)) return '--accent-color'
  if (/--color-surface/.test(tokenName)) return '--background-color'
  if (/--color-text/.test(tokenName)) return '--color'
  return null
}
