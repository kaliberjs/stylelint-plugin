import { matchesFile } from '../../machinery/filename.js'
import defineRule from '../../machinery/defineRule.js'
import docsUrl from '../../machinery/docsUrl.js'

/**
 * Matches hex colors (#fff, #000000, #RRGGBBAA), rgb/rgba/hsl/hsla function calls,
 * and named colors used as raw values.
 *
 * Intentionally does NOT match inside var() references — those are handled by color-variable-layering.
 */
const hardcodedColorPattern = /#[0-9a-fA-F]{3,8}\b|(?:rgba?|hsla?|hwb|lab|lch|oklch|oklab|color)\s*\(/

export const messages = {
  'no hardcoded colors': value =>
    `Unexpected hardcoded color value "${truncate(value)}"\n` +
    `use a CSS custom property from your color system instead (e.g. var(--color), var(--accent-color))`
}

export default defineRule({
  ruleName: 'no-hardcoded-colors',
  meta: {
    description: 'Disallow hardcoded color values (hex, rgb, hsl, etc.) in component CSS files',
    url: docsUrl(import.meta.dirname),
  },
  ruleInteraction: null,
  cssRequirements: null,
  messages,
  create() {
    return ({ originalRoot, report }) => {
      if (isInfraFile(originalRoot)) return

      originalRoot.walkDecls(decl => {
        const { value, prop } = decl

        // Skip custom property definitions — those are defining tokens, not consuming colors
        if (prop.startsWith('--')) return

        if (hardcodedColorPattern.test(value)) {
          report(decl, messages['no hardcoded colors'](value))
        }
      })
    }
  }
})

function isInfraFile(root) {
  return matchesFile(root, filename =>
    filename.includes('/cssGlobal/') ||
    filename.includes('/style-contexts') ||
    /colorScheme.*\.css/.test(filename)
  )
}

function truncate(value, maxLength = 60) {
  return value.length > maxLength ? value.slice(0, maxLength) + '…' : value
}
