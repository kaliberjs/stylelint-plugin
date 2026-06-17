import { messages, seedBreakpointCache } from './index.js'
import { test } from '../../machinery/test.js'

// Seed known breakpoints for testing
seedBreakpointCache(['30rem', '48rem', '64rem', '80rem', '95rem'])

test('media-query-convention', {
  'media-query-convention': {
    valid: [
      {
        title: 'allow min-width media queries with defined breakpoint',
        code: '.component { @media screen and (min-width: 48rem) { color: red; } }'
      },
      {
        title: 'allow not screen and (min-width) as mobile-first inverse',
        code: '.component { @media not screen and (min-width: 80rem) { color: red; } }'
      },
      {
        title: 'allow prefers-reduced-motion',
        code: '.component { @media (prefers-reduced-motion: no-preference) { transition: transform 0.3s; } }'
      },
      {
        title: 'allow prefers-color-scheme',
        code: '.component { @media (prefers-color-scheme: dark) { color: white; } }'
      },
      {
        title: 'allow hover media query',
        code: '.component { @media (hover: hover) { color: blue; } }'
      },
      {
        title: 'allow pointer media query',
        code: '.component { @media (pointer: fine) { padding: 4px; } }'
      },
      {
        title: 'allow media query without width features',
        code: '.component { @media print { display: none; } }'
      },
      {
        title: 'allow complex max-width query with orientation (edge case)',
        code: '.component { @media screen and (max-width: 63.9rem) and (max-height: 60rem) and (orientation: landscape) { color: red; } }'
      },
      {
        title: 'allow all defined breakpoints',
        code: '.component { @media screen and (min-width: 30rem) { color: red; } @media screen and (min-width: 64rem) { color: blue; } @media screen and (min-width: 95rem) { color: green; } }'
      },
      {
        title: 'allow not (min-width) without screen keyword',
        code: '.component { @media not (min-width: 48rem) { color: red; } }'
      },
    ],
    invalid: [
      {
        title: 'disallow max-width media queries',
        code: '.component { @media screen and (max-width: 768px) { color: red; } }',
        warnings: [messages['prefer min-width']('screen and (max-width: 768px)')]
      },
      {
        title: 'disallow simple max-width without screen keyword',
        code: '.component { @media (max-width: 48rem) { color: red; } }',
        warnings: [messages['prefer min-width']('(max-width: 48rem)')]
      },
      {
        title: 'disallow unrecognized breakpoint value',
        code: '.component { @media screen and (min-width: 42rem) { color: red; } }',
        warnings: [messages['breakpoint not recognized']('42rem', '30rem, 48rem, 64rem, 80rem, 95rem')]
      },
      {
        title: 'disallow ad-hoc pixel breakpoint',
        code: '.component { @media screen and (min-width: 500px) { color: red; } }',
        warnings: [messages['breakpoint not recognized']('500px', '30rem, 48rem, 64rem, 80rem, 95rem')]
      },
    ],
  },
})
