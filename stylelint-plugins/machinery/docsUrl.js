import { resolve } from 'node:path'

export default function docsUrl(ruleDir) {
  return `file://${resolve(ruleDir, 'readme.md')}`
}
