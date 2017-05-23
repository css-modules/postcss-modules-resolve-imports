'use strict';

const {resolve} = require('path');
const resolveImports = require('../../../index');
const setup = require('../../setup');

test('opts-modules', () => {
  const {resulting, exports: tokens} = setup(
    'local-by-default',
    'extract-imports',
    'scope',
    resolveImports({
      resolve: {
        modules: [resolve(__dirname, 'lib')],
      },
    })
  )(__dirname);

  expect(resulting).toMatchSnapshot();
  expect(tokens).toMatchSnapshot();
});
