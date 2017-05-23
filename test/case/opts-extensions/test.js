'use strict';

const resolveImports = require('../../../index');
const setup = require('../../setup');

test('opts-extensions', () => {
  const {resulting, exports: tokens} = setup(
    'local-by-default',
    'extract-imports',
    'scope',
    resolveImports({
      resolve: {
        extensions: ['.css'],
      },
    })
  )(__dirname);

  expect(resulting).toMatchSnapshot();
  expect(tokens).toMatchSnapshot();
});
