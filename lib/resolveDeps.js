'use strict';

const {comment} = require('postcss');
const {dirname, relative} = require('path');
const {readFileSync} = require('fs');
const {resolveModule} = require('./resolveModule');
const {resolvePaths, normalizeUrl} = require('./resolvePaths');
const {replaceSymbols} = require('icss-utils');

const PERMANENT_MARK = 2;
const TEMPORARY_MARK = 1;
// const UNMARKED = 0;

const importDeclaration = /^:import\((.+)\)$/;
const moduleDeclaration = /^:(?:export|import\(.+\))$/;

module.exports = resolveDeps;

/**
 * Topological sorting is used to resolve the deps order,
 * actually depth-first search algorithm.
 *
 * @see  https://en.wikipedia.org/wiki/Topological_sorting
 */
function resolveDeps(ast, result) {
  const {
    from: selfPath,
    graph,
    resolve,
    rootPath,
    rootTree,
  } = result.opts;

  const cwd = dirname(selfPath);
  const rootDir = dirname(rootPath);
  const processor = result.processor;
  const self = graph[selfPath] = graph[selfPath] || {};

  self.mark = TEMPORARY_MARK;

  const moduleExports = {};
  const translations = {};

  ast.walkRules(moduleDeclaration, rule => {
    if (importDeclaration.exec(rule.selector)) {
      rule.walkDecls(decl => translations[decl.prop] = decl.value);

      const dependencyPath = RegExp.$1.replace(/['"]/g, '');
      const absDependencyPath = resolveModule(dependencyPath, {cwd, resolve});

      if (!absDependencyPath) throw new Error(
        'Can\'t resolve module path from `' +
        cwd + '` to `' + dependencyPath + '`'
      );

      if (
        graph[absDependencyPath] &&
        graph[absDependencyPath].mark === TEMPORARY_MARK
      ) throw new Error(
        'Circular dependency was found between `' +
        selfPath + '` and `' + absDependencyPath + '`. ' +
        'Circular dependencies lead to the unpredictable state and considered harmful.'
      );

      if (!(
        graph[absDependencyPath] &&
        graph[absDependencyPath].mark === PERMANENT_MARK
      )) {
        const css = readFileSync(absDependencyPath, 'utf8');
        const lazyResult = processor.process(css, Object.assign({}, result.opts, {from: absDependencyPath}));

        updateTranslations(translations, lazyResult.root.exports);
      } else {
        updateTranslations(translations, graph[absDependencyPath].exports);
      }

      return void rule.remove();
    }

    rule.walkDecls(decl => moduleExports[decl.prop] = decl.value);
    rule.remove();
  });

  replaceSymbols(ast, translations);

  for (const token in moduleExports)
    for (const genericId in translations)
      moduleExports[token] = moduleExports[token]
        .replace(genericId, translations[genericId]);

  self.mark = PERMANENT_MARK;
  self.exports = ast.exports = moduleExports;

  // resolve paths
  if (cwd !== rootDir) resolvePaths(ast, cwd, rootDir);

  const importNotes = comment({
    parent: rootTree,
    raws: {before: rootTree.nodes.length === 0 ? '' : '\n\n'},
    text: ` imported from ${normalizeUrl(relative(rootDir, selfPath))} `,
  });

  const childNodes = ast.nodes.map(i => {
    const node = i.clone({parent: rootTree});

    if (
      typeof node.raws.before === 'undefined' ||
      node.raws.before === ''
    ) node.raws.before = '\n\n';

    return node;
  });

  rootTree.nodes = rootTree.nodes.concat(importNotes, childNodes);
}

function updateTranslations(translations, tokens) {
  for (const genericId in translations) {
    const token = translations[genericId];

    if (tokens.hasOwnProperty(token))
      translations[genericId] = tokens[token];
  }
}
