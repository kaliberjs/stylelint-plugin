import { messages, seedTokenCache } from './index.js'
import { test } from '../../machinery/test.js'

// Seed the token cache with typical context tokens (as would be found in style-contexts.css)
seedTokenCache([
  '--background-color',
  '--color',
  '--accent-color',
  '--accent-color--60',
  '--accent-color--40',
  '--shade-color',
  '--contrast-color',
  '--muted-color',
  '--error-color',
  '--input-border-color',
  '--focus-border-color',
  '--button-background-color',
  '--button-color',
  '--primary-text-color',
  '--secondary-text-color',
  '--color-error',
  '--hairline-color',
  '--link-color',
])

test('color-variable-layering', {
  'color-variable-layering': {
    valid: [
      {
        title: 'allow context tokens in component files',
        filename: 'features/buildingBlocks/Button.css',
        code: '.component { color: var(--color); background-color: var(--accent-color); }'
      },
      {
        title: 'allow non-color custom properties in component files',
        filename: 'features/buildingBlocks/Card.css',
        code: '.component { padding: var(--size-16); font-size: var(--font-size-md); }'
      },
      {
        title: 'allow palette tokens in cssGlobal files',
        filename: 'cssGlobal/color.css',
        code: ':root { --color-blue-500: #0058ff; }'
      },
      {
        title: 'allow semantic tokens in style-contexts files',
        filename: 'cssGlobal/style-contexts.css',
        code: '.component { --accent-color: var(--color-primary); }'
      },
      {
        title: 'allow palette tokens in theme files',
        filename: 'cssGlobal/themes/landal.css',
        code: ':root { --color-primary: var(--color-teal); }'
      },
      {
        title: 'allow custom property definitions using palette tokens',
        filename: 'features/buildingBlocks/Tile.css',
        code: '.component { --my-token: var(--color-blue-500); }'
      },
      {
        title: 'allow context tokens with error naming pattern',
        filename: 'features/buildingBlocks/Form.css',
        code: '.component { border-color: var(--color-error); color: var(--error-color); }'
      },
      {
        title: 'allow custom infra file paths via ignoreFiles option',
        filename: 'features/myCustomInfra/helpers.css',
        config: { ignoreFiles: ['myCustomInfra'] },
        code: '.component { color: var(--color-blue-500); }'
      },
    ],
    invalid: [
      {
        title: 'disallow palette tokens (--color-blue-500) in component files',
        filename: 'features/buildingBlocks/Card.css',
        code: '.component { color: var(--color-blue-500); }',
        warnings: [messages['use context token']('--color-blue-500', null)]
      },
      {
        title: 'disallow semantic tokens (--color-primary) in component files',
        filename: 'features/buildingBlocks/ApplyBanner.css',
        code: '.component { background-color: var(--color-primary); }',
        warnings: [messages['use context token']('--color-primary', '--accent-color')]
      },
      {
        title: 'disallow semantic tokens (--color-surface) in component files',
        filename: 'features/buildingBlocks/Section.css',
        code: '.component { background-color: var(--color-surface); }',
        warnings: [messages['use context token']('--color-surface', '--background-color')]
      },
      {
        title: 'disallow semantic tokens (--color-text) in component files',
        filename: 'features/pageOnly/Footer.css',
        code: '.component { color: var(--color-text); }',
        warnings: [messages['use context token']('--color-text', '--color')]
      },
      {
        title: 'disallow palette tokens (--color-gray-200) in component files',
        filename: 'pages/Skills.css',
        code: '.component { background-color: var(--color-gray-200); }',
        warnings: [messages['use context token']('--color-gray-200', null)]
      },
      {
        title: 'disallow multiple violations in one declaration',
        filename: 'features/buildingBlocks/Hero.css',
        code: '.component { background: linear-gradient(var(--color-blue-500), var(--color-blue-700)); }',
        warnings: [
          messages['use context token']('--color-blue-500', null),
          messages['use context token']('--color-blue-700', null),
        ]
      },
      {
        title: 'provide custom suggestions via suggestions option',
        filename: 'features/buildingBlocks/Hero.css',
        config: { suggestions: { '--color-primary-custom': '--accent-color-custom' } },
        code: '.component { color: var(--color-primary-custom); }',
        warnings: [messages['use context token']('--color-primary-custom', '--accent-color-custom')]
      },
    ],
  },
})
