import { readCssGlobalFile } from './cssGlobal.js'

const breakpointCache = new Map()

/**
 * Reads and parses breakpoints from the cssGlobal directory.
 * Tries media.js first, then media.css. Results are cached per path.
 *
 * @param {string} cssGlobalPath
 * @returns {Set<string> | null}
 */
export function getBreakpoints(cssGlobalPath) {
  if (breakpointCache.has('__test__')) return breakpointCache.get('__test__')
  if (breakpointCache.has(cssGlobalPath)) return breakpointCache.get(cssGlobalPath)

  const jsContent = readCssGlobalFile(cssGlobalPath, 'media.js')
  if (jsContent) {
    const breakpoints = parseMediaJs(jsContent)
    breakpointCache.set(cssGlobalPath, breakpoints)
    return breakpoints
  }

  const cssContent = readCssGlobalFile(cssGlobalPath, 'media.css')
  if (cssContent) {
    const breakpoints = parseMediaCss(cssContent)
    breakpointCache.set(cssGlobalPath, breakpoints)
    return breakpoints
  }

  breakpointCache.set(cssGlobalPath, null)
  return null
}

/**
 * Seeds the breakpoint cache for testing.
 *
 * @param {string[]} values - Array of breakpoint values (e.g., ['48rem', '80rem'])
 */
export function seedBreakpointCache(values) {
  breakpointCache.set('__test__', new Set(values))
}

/**
 * Parses media.js content to extract breakpoint values.
 * Handles two formats found across Kaliber projects:
 *
 * 1. Full query strings: `viewportMd: 'screen and (min-width: 768px)'`
 *    → extracts "768px"
 *
 * 2. Raw values: `breakpointMd: '768px'` or `breakpointMd: '48em'`
 *    → extracts "768px" / "48em"
 *
 * Non-width entries like `touch: '(pointer: coarse)'` are ignored.
 *
 * @param {string} content
 * @returns {Set<string>}
 */
function parseMediaJs(content) {
  const breakpoints = new Set()
  const entryPattern = /(\w+)\s*:\s*['"]([^'"]+)['"]/g
  let match

  while ((match = entryPattern.exec(content)) !== null) {
    const value = match[2]

    const widthMatch = value.match(/(?:min-width|max-width)\s*:\s*([^)]+)/)
    if (widthMatch) {
      breakpoints.add(widthMatch[1].trim())
      continue
    }

    if (/^\d+(\.\d+)?(px|em|rem)$/.test(value.trim())) {
      breakpoints.add(value.trim())
    }
  }

  return breakpoints
}

/**
 * Parses media.css content to extract breakpoint values.
 * Format: `@custom-media --viewport-md screen and (min-width: 768px);`
 *
 * @param {string} content
 * @returns {Set<string>}
 */
function parseMediaCss(content) {
  const breakpoints = new Set()
  const pattern = /(?:min-width|max-width)\s*:\s*([^)]+)/g
  let match

  while ((match = pattern.exec(content)) !== null) {
    breakpoints.add(match[1].trim())
  }

  return breakpoints
}
