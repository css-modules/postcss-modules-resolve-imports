'use strict';

const setup = require('../../setup');

test('resolve-paths', () => {
  const {resulting} = setup(
    'local-by-default',
    'extract-imports',
    'scope',
    'self'
  )(__dirname);

  expect(resulting).toMatchSnapshot();
});
