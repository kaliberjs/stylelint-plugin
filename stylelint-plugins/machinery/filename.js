import path from 'node:path'

export {
  matchesFile,
  isFile,
}

function matchesFile({ source: { input } }, predicate) {
  return !!input.file && predicate(input.file)
}

function isFile(root, name) {
  return matchesFile(root, filename => path.basename(filename) === name)
}
