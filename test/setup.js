'use strict';

const {readFileSync} = require('fs');
const {basename, resolve} = require('path');
const postcss = require('postcss');

const LOADER = {
  'local-by-default': () => require('postcss-modules-local-by-default'),
  'extract-imports': () => require('postcss-modules-extract-imports'),
  scope: () => new require('postcss-modules-scope')({generateScopedName}),
  self: () => require('../index.js'),
};

module.exports = setup;

function setup(...plugins) {
  const loadedPlugins = plugins.map(name =>
    typeof name === 'string' ? LOADER[name]() : name);

  return setupCase;

  function setupCase(directory) {
    const runner = postcss(loadedPlugins);
    const sourcepath = resolve(directory, 'source.css');
    const expectedpath = resolve(directory, 'expected.css');

    const source = readFileSync(sourcepath, 'utf8');
    const expected = readFileSync(expectedpath, 'utf8');
    const lazyResult = runner.process(source, {from: sourcepath});

    return {
      exports: lazyResult.root.exports,
      expected: expected.replace(/\r/g, ''),
      resulting: lazyResult.css.replace(/\r/g, ''),
      source,
    };
  }
}

function generateScopedName(local, filename) {
  return `_${basename(filename).split('.').shift()}_${local}`;
}
