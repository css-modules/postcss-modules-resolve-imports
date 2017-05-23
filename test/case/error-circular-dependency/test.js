'use strict';

const setup = require('../../setup');

test('error-circular-dependency', () => {
  expect(() => setup(
    'local-by-default',
    'extract-imports',
    'scope',
    'self'
  )(__dirname)).toThrow();
});
