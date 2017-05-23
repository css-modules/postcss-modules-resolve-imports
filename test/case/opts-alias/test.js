'use strict';

const {resolve} = require('path');
const resolveImports = require('../../../index');
const setup = require('../../setup');

test('opts-alias', () => {
  const {resulting, exports: tokens} = setup(
    'local-by-default',
    'extract-imports',
    'scope',
    resolveImports({
      resolve: {
        alias: {
          button: resolve(__dirname, 'lib/button/button.css'),
        },
      },
    })
  )(__dirname);

  expect(resulting).toMatchSnapshot();
  expect(tokens).toMatchSnapshot();
});
