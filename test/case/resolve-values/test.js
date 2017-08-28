'use strict';

const resolveImports = require('../../../index');
const setup = require('../../setup');

test('resolve-readme-example', () => {
  const {resulting, exports: tokens} = setup(
    'values',
    'extract-imports',
    resolveImports({icssExports: true})
  )(__dirname);

  expect(resulting).toMatchSnapshot();
  expect(tokens).toMatchSnapshot();
});
