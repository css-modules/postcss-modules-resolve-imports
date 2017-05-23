'use strict';

const resolveImports = require('../../../index');
const setup = require('../../setup');

test('opts-explicit-exports', () => {
  const {resulting, exports: tokens} = setup(
    'local-by-default',
    'extract-imports',
    'scope',
    resolveImports({icssExports: true})
  )(__dirname);

  expect(resulting).toMatchSnapshot();
  expect(tokens).toMatchSnapshot();
});
