const { findRootDirectory } = require('./findRootDirectory')
const path = require('node:path')
const fs = require('fs-extra')

module.exports = {
  findCssGlobalFiles,
}

function findCssGlobalFiles(from) {
  const propertiesDirectory = path.resolve(findRootDirectory(from), './src/cssGlobal')
  return fs.existsSync(propertiesDirectory)
    ? fs.readdirSync(propertiesDirectory)
        .filter(file => file.endsWith('.css')) // Filter only .css files
        .map(file => path.resolve(propertiesDirectory, file))
    : []
}
