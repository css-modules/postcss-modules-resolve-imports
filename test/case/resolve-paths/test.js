'use strict';

const setup = require('../../setup');
const resolveImports = require('../../../index');

test('resolve-paths', () => {
  const {resulting} = setup(
    'local-by-default',
    'extract-imports',
    'scope',
    'self'
  )(__dirname);

  expect(resulting).toMatchSnapshot();
});

test('resolve-paths custom root', () => {
  const {resulting} = setup(
    'local-by-default',
    'extract-imports',
    'scope',
    resolveImports({
      root: process.cwd(),
    }),
  )(__dirname, undefined);

  expect(resulting).toMatchSnapshot();
});
