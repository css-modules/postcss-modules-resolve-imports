'use strict';

const {readFileSync} = require('fs');
const {basename, resolve} = require('path');
const postcss = require('postcss');

const cssmodulesLocalByDefault = require('postcss-modules-local-by-default');
const cssmodulesExtractImports = require('postcss-modules-extract-imports');
const cssmodulesScope = require('postcss-modules-scope');
const cssmodulesValues = require('postcss-icss-values');
const cssmodulesResolveImports = require('../index.js');

const LOADER = {
  values: () => cssmodulesValues,
  'local-by-default': () => cssmodulesLocalByDefault,
  'extract-imports': () => cssmodulesExtractImports,
  scope: () => new cssmodulesScope({generateScopedName}),
  self: () => cssmodulesResolveImports,
};

module.exports = setup;

function setup(...plugins) {
  const loadedPlugins = plugins.map(name =>
    typeof name === 'string' ? LOADER[name]() : name);

  return setupCase;

  function setupCase(directory) {
    const runner = postcss(loadedPlugins);
    const sourcepath = resolve(directory, 'source.css');

    const source = readFileSync(sourcepath, 'utf8');
    const lazyResult = runner.process(source, {from: sourcepath});

    return {
      exports: lazyResult.root.exports,
      resulting: lazyResult.css.replace(/\r/g, ''),
      source,
    };
  }
}

function generateScopedName(local, filename) {
  return `_${basename(filename).split('.').shift()}_${local}`;
}
