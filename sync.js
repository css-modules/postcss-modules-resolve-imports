'use strict';

/**
 * Notes about postcss plugin's api
 *
 * Containers are iterated with .walk* methods.
 * Rules are actually selectors.
 * Decls are actually css rules (keys prop, value).
 *
 * @see  http://api.postcss.org/AtRule.html#walkRules
 */

const {plugin} = require('postcss');
const postcss = require('postcss');
const resolveDeps = require('./lib/resolveDeps');

const extractPlugin = plugin('extract-plugin', () => resolveDeps);

module.exports = plugin('postcss-modules-resolve-imports', resolveImportsPlugin);

/**
 * dangerouslyPrevailCyclicDepsWarnings
 * explicitExports
 * resolve.alias
 * resolve.extensions
 * resolve.modules
 */
function resolveImportsPlugin({explicitExports, resolve = {}} = {}) {
  return resolveImports;

  function resolveImports(ast, result) {
    const graph = {};
    const processor = createProcessor(result.processor.plugins);
    const rootPath = ast.source.input.file;
    const rootTree = postcss.root();

    resolveDeps(ast, {opts: {from: rootPath, graph, resolve, rootPath, rootTree}, processor});

    if (explicitExports) {
      const exportRule = postcss.rule({selector: ':export'});

      for (const className in ast.exports)
        exportRule.append({
          prop: className,
          value: ast.exports[className],
          raws: {before: '\n  '},
        });

      rootTree.prepend(exportRule);
    }

    rootTree.exports = ast.exports;
    result.root = rootTree;
  }
}

function createProcessor(plugins) {
  const selfposition = plugins.findIndex(bySelfName);
  const precedingPlugins = plugins.slice(0, selfposition);

  return postcss(precedingPlugins.concat(extractPlugin));
}

function bySelfName(plugin) {
  return plugin.postcssPlugin === 'postcss-modules-resolve-imports';
}
