'use strict';

const setup = require('../../setup');

test('resolve-node-module', () => {
  const {resulting, exports: tokens} = setup(
    'local-by-default',
    'extract-imports',
    'scope',
    'self'
  )(__dirname);

  expect(resulting).toMatchSnapshot();
  expect(tokens).toMatchSnapshot();
});
