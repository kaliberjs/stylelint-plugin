import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

/**
 * Shared cssGlobal reader — caches reads per cssGlobal path.
 *
 * Rules that need data from cssGlobal/ (style-contexts, media, motion, etc.)
 * should use this module instead of reading files directly.
 *
 * Configure via the `cssGlobal` option in .stylelintrc:
 *
 *   "kaliber/color-variable-layering": [true, { "cssGlobal": "src/cssGlobal" }]
 *
 * @example
 *   import { readCssGlobalFile } from '../../machinery/cssGlobal.js'
 *   const content = readCssGlobalFile(options?.cssGlobal, 'style-context.css')
 */

const fileCache = new Map()

/**
 * Reads a file from the configured cssGlobal directory. Results are cached
 * per resolved path so files are read at most once per lint session.
 *
 * @param {string} cssGlobalPath - Relative path to the cssGlobal directory (from cwd)
 * @param {string} filename - File to read within cssGlobal (e.g. 'style-context.css')
 * @returns {string | null} - File contents or null if not found
 */
export function readCssGlobalFile(cssGlobalPath, filename) {
  if (!cssGlobalPath) return null

  const fullPath = resolve(process.cwd(), cssGlobalPath, filename)
  if (fileCache.has(fullPath)) return fileCache.get(fullPath)

  try {
    const content = readFileSync(fullPath, 'utf-8')
    fileCache.set(fullPath, content)
    return content
  } catch {
    fileCache.set(fullPath, null)
    return null
  }
}

/**
 * Checks if a file path is inside the configured cssGlobal directory.
 * Falls back to a heuristic check if no cssGlobal path is configured.
 *
 * @param {string} filePath - The file being linted
 * @param {string} [cssGlobalPath] - Configured cssGlobal path
 * @returns {boolean}
 */
export function isInsideCssGlobal(filePath, cssGlobalPath) {
  if (cssGlobalPath) {
    const resolvedCssGlobal = resolve(process.cwd(), cssGlobalPath)
    return filePath.startsWith(resolvedCssGlobal)
  }
  return filePath.includes('/cssGlobal/')
}

/**
 * Seed a file into the cache for testing.
 *
 * @param {string} key - Cache key (use the filename, e.g. 'style-context.css')
 * @param {string | null} content - File contents
 */
export function seedFileCache(key, content) {
  fileCache.set(key, content)
}
