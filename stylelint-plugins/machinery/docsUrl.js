import { resolve, basename } from 'node:path'

export default function docsUrl(ruleDir) {
  return `file://${resolve(ruleDir, '..', '..', '..', 'docs', basename(ruleDir) + '.md')}`
}
