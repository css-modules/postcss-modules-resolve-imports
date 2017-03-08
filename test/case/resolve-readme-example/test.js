'use strict';

const resolveImports = require('../../../index');
const setup = require('../../setup');
const test = require('tape');

test('resolve-readme-example', t => {
  const {expected, resulting, exports: tokens} = setup(
    'local-by-default',
    'extract-imports',
    'scope',
    resolveImports({icssExports: true})
  )(__dirname);

  t.equal(resulting.trim(), expected.trim());
  t.deepEqual(tokens, {continueButton: '_source_continueButton _button_button'});
  t.end();
});
