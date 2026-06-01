import { messages } from './index.js'
import { test } from '../../machinery/test.js'

test('css-global', {
  'css-global': {
    valid: [
      {
        title: 'valid - allow custom properties in cssGlobal',
        filename: 'src/cssGlobal/abc.css',
        code: `:root { --x: 0; }`,
      },
    ],
    invalid: [
      {
        title: 'invalid - only allow :root in cssGlobal directory',
        filename: 'src/cssGlobal/abc.css',
        code: `
          div { }
          .test { }
        `,
        warnings: [
          messages['only']('div'),
          messages['only']('.test')
        ],
      },
      {
        title: 'invalid - only allow :root at-rules in cssGlobal directory',
        filename: 'src/cssGlobal/abc.css',
        code: `
          @keyframes x { }
          @media x { }
        `,
        warnings: [
          messages['only']('@keyframes'),
          messages['only']('@media')
        ],
      },
      {
        code: `:root { --x: 0; }`,
        warnings: [messages['no'](':root')]
      },
    ],
  },
  'layout-related-properties': {
    valid: [
      {
        title: 'valid - allow custom properties in child selectors',
        code: `
          .parent {
            & > .child{
              --x: 0;
            }
          }
        `,
      },
    ],
    invalid: [],
  }
})
