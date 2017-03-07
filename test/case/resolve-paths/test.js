'use strict';

const setup = require('../../setup');
const test = require('tape');

test('resolve-paths', t => {
  const {expected, resulting} = setup(
    'local-by-default',
    'extract-imports',
    'scope',
    'self'
  )(__dirname);

  t.equal(resulting.trim(), expected.trim());
  t.end();
});
