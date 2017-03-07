'use strict';

const {dirname} = require('path');
const {readFileSync} = require('fs');
const {resolveModule} = require('./resolveModule');
const {resolvePaths} = require('./resolvePaths');

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

  for (const token in moduleExports)
    for (const genericId in translations)
      moduleExports[token] = moduleExports[token]
        .replace(genericId, translations[genericId]);

  self.mark = PERMANENT_MARK;
  self.exports = ast.exports = moduleExports;

  // resolve paths
  if (cwd !== rootDir) resolvePaths(ast, cwd, rootDir);

  // append comment
  rootTree.append(ast.nodes);
}

function updateTranslations(translations, tokens) {
  for (const genericId in translations) {
    const token = translations[genericId];

    if (tokens.hasOwnProperty(token))
      translations[genericId] = tokens[token];
  }
}
