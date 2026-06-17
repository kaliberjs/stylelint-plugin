import { getBreakpoints, seedBreakpointCache as _seedBreakpointCache } from '../../machinery/breakpoints.js'
import defineRule from '../../machinery/defineRule.js'
import docsUrl from '../../machinery/docsUrl.js'

export const seedBreakpointCache = _seedBreakpointCache

export const messages = {
  'prefer min-width': value =>
    `Unexpected "max-width" media query\n` +
    `use "min-width" for mobile-first design, or "not screen and (min-width: ...)" for the inverse\n` +
    `found: @media ${value}`,
  'breakpoint not recognized': (value, available) =>
    `Unrecognized breakpoint value "${value}"\n` +
    `use a breakpoint defined in cssGlobal/media: ${available}`,
}

export default defineRule({
  ruleName: 'media-query-convention',
  meta: {
    description: 'Enforce consistent @media query patterns: prefer min-width, use defined breakpoints',
    url: docsUrl(import.meta.dirname),
  },
  ruleInteraction: null,
  cssRequirements: null,
  messages,
  create() {
    return ({ originalRoot, report, options }) => {
      const breakpoints = getBreakpoints(options?.cssGlobal)

      originalRoot.walkAtRules('media', atRule => {
        const params = atRule.params

        if (isNonWidthQuery(params)) return

        const widthMatch = params.match(widthPattern)
        if (!widthMatch) return

        const [, type, value] = widthMatch
        const trimmedValue = value.trim()

        // Flag max-width usage
        if (type === 'max-width') {
          const widthMatches = params.match(/max-width/g)
          if (widthMatches && widthMatches.length === 1 && isComplexQuery(params)) return

          report(atRule, messages['prefer min-width'](params))
          return
        }

        // Validate breakpoint value against defined breakpoints
        if (breakpoints && breakpoints.size > 0 && !breakpoints.has(trimmedValue)) {
          const available = [...breakpoints].join(', ')
          report(atRule, messages['breakpoint not recognized'](trimmedValue, available))
        }
      })
    }
  }
})

/** Extracts a min-width or max-width value from a media query params string. */
const widthPattern = /\(\s*(min-width|max-width)\s*:\s*([^)]+)\)/

/**
 * Non-width media features that are always allowed regardless of breakpoint convention.
 * These don't relate to viewport sizing and should pass through unchecked.
 */
const nonWidthFeatures = [
  'prefers-reduced-motion',
  'prefers-color-scheme',
  'prefers-contrast',
  'hover',
  'pointer',
  'orientation',
  'display-mode',
  'forced-colors',
]

function isNonWidthQuery(params) {
  return nonWidthFeatures.some(feature => params.includes(feature))
}

function isComplexQuery(params) {
  return params.includes('orientation') || params.includes('max-height') || params.includes('aspect-ratio')
}
