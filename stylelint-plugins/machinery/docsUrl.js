import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

export default function docsUrl(ruleDir) {
  return pathToFileURL(resolve(ruleDir, 'readme.md')).href
}
