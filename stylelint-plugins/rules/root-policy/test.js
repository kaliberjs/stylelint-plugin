import { messages } from './index.js'
import { test } from '../../machinery/test.js'

test('root-policy', {
  'root-policy': {
    valid: [
      { code: '.good { position: relative; z-index: 0; }', warnings: 0 },
      {
        title: `├─ take @media into account [1]`,
        code: `
          .good {
            position: relative;
            @media x {
              z-index: 0;
            }
          }
        `,
      },
      {
        title: `└─ take @media into account [2]`,
        code: `
          .good {
            @media x {
              z-index: 0;
              position: relative;
            }
          }
        `,
      },
      {
        title: `└─ take class chaining into account [1]`,
        code: `
          .good {
            &.test {
              z-index: 0;
              position: relative;
            }
          }
        `,
      },
      {
        title: `└─ take class chaining into account [2]`,
        code: `
          .good {
            position: relative;
            &.test {
              z-index: 0;
            }
          }
        `,
      },
      {
        title: 'accept var() in z-index value',
        code: '.good { position: relative; z-index: var(--z); }',
      },
      {
        title: 'accept var() in position value',
        code: '.good { position: var(--pos); z-index: 0; }',
      },
      {
        title: 'accept calc() in z-index value',
        code: '.good { position: relative; z-index: calc(var(--base) + 0); }',
      },
      {
        title: 'fix z-index to 0',
        code: '.good { position: relative; z-index: 1; }',
        output: '.good { position: relative; z-index: 0; }',
      },
      {
        title: 'fix z-index to 0 (negative value)',
        code: '.good { position: relative; z-index: -1; }',
        output: '.good { position: relative; z-index: 0; }',
      },
      {
        title: 'fix z-index to 0 inside @media',
        code: `.good { @media x { position: relative; z-index: 2; } }`,
        output: `.good { @media x { position: relative; z-index: 0; } }`,
      },
      {
        title: 'fix z-index to 0 inside class chaining',
        code: `.good { &.test { position: relative; z-index: 3; } }`,
        output: `.good { &.test { position: relative; z-index: 0; } }`,
      },
    ],
    invalid: [
      {
        title: `don't allow \`z-index\` in root without \`position: relative\``,
        code: '.bad { z-index: 0; }',
        warnings: [messages['root - z-index without position relative']]
      },
      {
        title: `├─ take @media into account [1]`,
        code: `.bad { @media x { z-index: 0; } }`,
        warnings: [messages['root - z-index without position relative']]
      },
      {
        title: `└─ take @media into account [2]`,
        code: `.bad { z-index: 0; @media x { position: relative; } }`,
        warnings: [messages['root - z-index without position relative']]
      },
      {
        title: `only allow a \`z-index: 0\` in root`,
        code: '.bad { position: relative; z-index: 1; }',
        warnings: [messages['root - z-index not 0']]
      },
    ]
  },
  'layout-related-properties': {
    valid: [
      { code: '.good { z-index: 0; position: relative; }' },
      { code: '.good { position: relative; z-index: 0; & > .test { position: absolute; z-index: 1; } }' },
      { code: '.good { z-index: 0; position: relative; & > .test { z-index: 1; } }' },
    ],
    invalid: [
    ]
  },
})
