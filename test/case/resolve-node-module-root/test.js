'use strict';

const path = require('path');
const setup = require('../../setup');
const resolveImports = require('../../../index');
 
describe('resolve-node-module root', () => {
  test('defaults to dirname(file)', () => {
    const {resulting: resulting1} = setup(
      require('postcss-icss-values'),
      'local-by-default',
      'extract-imports',
      'scope',
      'self'
    )(__dirname, 'source.css');

    const {resulting: resulting2} = setup(
      require('postcss-icss-values'),
      'local-by-default',
      'extract-imports',
      'scope',
      'self'
    )(__dirname, path.join('node_modules', 'button', 'button.css'));

    expect(resulting1).toMatchSnapshot();
    expect(resulting2).toMatchSnapshot();
  });
  
  /*
   * run process() on entry-point css-files in different directories, both of
   * which import the same file 'node_modules/button/background.css'
   *
   * it is important that the locally scoped classnames in the included
   * 'node_modules/button/background.css' remain the same, no matter
   * which entry point is used (source.css or button.css)
   *
   * (always use relative path of file to rootDir, which is cwd)
   */

  test('process.cwd', () => {
    const root = process.cwd();
    
    const {resulting: resulting1} = setup(
      require('postcss-icss-values'),
      'local-by-default',
      'extract-imports',
      'scope',
      resolveImports({
        root: root,
      }),
    )(__dirname, 'source.css');

    const {resulting: resulting2} = setup(
      require('postcss-icss-values'),
      'local-by-default',
      'extract-imports',
      'scope',
      resolveImports({
        root: root,
      }),
    )(__dirname, path.join('node_modules', 'button', 'button.css'));

    expect(resulting1).toMatchSnapshot();
    expect(resulting2).toMatchSnapshot();
  });
});
