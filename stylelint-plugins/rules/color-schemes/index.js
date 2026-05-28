import { matchesFile } from '../../machinery/filename.js'

const allowedInColorScheme = [
  'color', 'background-color', 'border-color',
  'stroke', 'fill',
]

export const messages = {
  'only color related properties': prop =>
    `Unexpected property ${prop}\n` +
    `you can only use color related properties in color schemes - ` +
    `move the property to another file or use one of the advanced color values like #RRGGBBAA or color-mod(...)`
}

export default {
  ruleName: 'color-schemes',
  ruleInteraction: {
    'layout-related-properties': {
      childAllowCss: isColorScheme,
    },
    'selector-policy': {
      doubleSelectorsAllowCss: isColorScheme,
      nonDirectChildSelectorsAllowCss: isColorScheme,
    },
  },
  cssRequirements: null,
  messages,
  create(config) {
    return ({ originalRoot, report }) => {
      if (!isColorScheme(originalRoot)) return
      originalRoot.walkDecls(decl => {
        const { prop } = decl
        if (allowedInColorScheme.includes(prop)) return
        report(decl, messages['only color related properties'](prop))
      })
    }
  }
}

function isColorScheme(root) { return matchesFile(root, filename => /colorScheme.*\.css/.test(filename)) }
