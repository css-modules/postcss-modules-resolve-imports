'use strict';

const {parseValues, stringifyValues} = require('css-selector-tokenizer');
const {relative, resolve, sep} = require('path');

const isRelativeUrl = filepath => /^(?:\.\.?(?:[\\\/]|$))/.test(filepath);

exports.isRelativeUrl = isRelativeUrl;
exports.iterateValues = iterateValues;
exports.resolvePaths = resolvePaths;

function iterateValues(values, iteratee) {
  values.nodes.forEach(value =>
    value.nodes.forEach(item => iteratee(item)));
}

function resolvePaths(ast, from, to) {
  // @import
  ast.walkAtRules(atrule => {
    if (atrule.name === 'import') {
      const values = parseValues(atrule.params);

      iterateValues(values, item => {
        if (item.type === 'string' && isRelativeUrl(item.value))
          item.value = resolveUrl(item.value, from, to);

        if (item.type === 'url' && isRelativeUrl(item.url))
          item.url = resolveUrl(item.url, from, to);
      });

      atrule.params = stringifyValues(values);
    }
  });

  // background: url(..)
  ast.walkDecls(decl => {
    if (/url/.test(decl.value)) {
      const values = parseValues(decl.value);

      iterateValues(values, item => {
        if (item.type === 'url' && isRelativeUrl(item.url))
          item.url = resolveUrl(item.url, from, to);
      });

      decl.value = stringifyValues(values);
    }
  });
}

function resolveUrl(url, from, to) {
  const resolvedUrl = relative(to, resolve(from, url));

  return !isRelativeUrl(resolvedUrl)
    ? '.' + sep + resolvedUrl
    : resolvedUrl;
}
