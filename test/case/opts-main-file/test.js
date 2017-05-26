'use strict';

const resolveImports = require('../../../index');
const setup = require('../../setup');

test('opts-main-file', () => {
  const {resulting, exports: tokens} = setup(
    'local-by-default',
    'extract-imports',
    'scope',
    resolveImports({
      resolve: {
        mainFile: 'a.css',
      },
    })
  )(__dirname);

  expect(resulting).toMatchSnapshot();
  expect(tokens).toMatchSnapshot();
});
