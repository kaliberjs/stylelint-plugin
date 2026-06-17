import { messages } from './index.js'
import { test } from '../../machinery/test.js'

test('no-hardcoded-colors', {
  'no-hardcoded-colors': {
    valid: [
      {
        title: 'allow CSS custom properties in component files',
        filename: 'features/buildingBlocks/Button.css',
        code: '.component { color: var(--color); background-color: var(--accent-color); }'
      },
      {
        title: 'allow hardcoded colors in cssGlobal files',
        filename: 'cssGlobal/color.css',
        code: ':root { --color-blue-500: #0058ff; --color-black: #000; }'
      },
      {
        title: 'allow hardcoded colors in style-contexts files',
        filename: 'cssGlobal/style-contexts.css',
        code: '.component { color: #fff; }'
      },
      {
        title: 'allow hardcoded colors in colorScheme files',
        filename: 'colorScheme/dark.css',
        code: '.component { background-color: #1a1a1a; }'
      },
      {
        title: 'allow non-color values in component files',
        filename: 'features/buildingBlocks/Card.css',
        code: '.component { padding: 16px; width: 100%; opacity: 0.5; }'
      },
      {
        title: 'allow transparent and currentColor keywords',
        filename: 'features/buildingBlocks/Link.css',
        code: '.component { background-color: transparent; color: currentColor; border-color: inherit; }'
      },
      {
        title: 'allow custom property definitions in component files',
        filename: 'features/buildingBlocks/Tile.css',
        code: '.component { --title-gradient: linear-gradient(to bottom, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.6) 100%); }'
      },
    ],
    invalid: [
      {
        title: 'disallow hex colors in component files',
        filename: 'features/buildingBlocks/Panel.css',
        code: '.component { background-color: #1a1a1a; }',
        warnings: [messages['no hardcoded colors']('#1a1a1a')]
      },
      {
        title: 'disallow rgba in component files',
        filename: 'features/buildingBlocks/Overlay.css',
        code: '.component { background-color: rgba(0, 0, 0, 0.2); }',
        warnings: [messages['no hardcoded colors']('rgba(0, 0, 0, 0.2)')]
      },
      {
        title: 'disallow hex shorthand in component files',
        filename: 'features/pageOnly/Footer.css',
        code: '.component { color: #fff; }',
        warnings: [messages['no hardcoded colors']('#fff')]
      },
      {
        title: 'disallow hsl in component files',
        filename: 'features/buildingBlocks/Card.css',
        code: '.component { border-color: hsl(210, 100%, 50%); }',
        warnings: [messages['no hardcoded colors']('hsl(210, 100%, 50%)')]
      },
    ],
  },
})
