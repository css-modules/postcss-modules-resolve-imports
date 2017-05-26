'use strict';

const {join, parse, resolve} = require('path');
const {readFileSync, statSync} = require('fs');

exports.applyAliases = applyAliases;
exports.isDirectory = isDirectory;
exports.isFile = isFile;
exports.isNodeModule = isNodeModule;
exports.nodeModulesPaths = nodeModulesPaths;
exports.resolveAsDir = resolveAsDir;
exports.resolveAsFile = resolveAsFile;
exports.resolveModule = resolveModule;

function applyAliases(filepath, aliases = {}) {
  const keys = Object.keys(aliases);

  for (let i = 0; i < keys.length; ++i) {
    const key = keys[i];

    if (filepath.startsWith(key)) return filepath.replace(key, aliases[key]);
  }

  return filepath;
}

function isDirectory(filepath) {
  try {
    return statSync(filepath).isDirectory();
  } catch (er) {
    if (er && er.code === 'ENOENT') return false;
    throw er;
  }
}

function isFile(filepath) {
  try {
    return statSync(filepath).isFile();
  } catch (er) {
    if (er && er.code === 'ENOENT') return false;
    throw er;
  }
}

// ../ | ./ | / | c:\
function isNodeModule(filepath) {
  return !/^(?:\.\.?(?:[\\\/]|$)|\/|[A-Za-z]:[\\\/])/.test(filepath);
}

function nodeModulesPaths(start) {
  const paths = [start];
  let parsed = parse(start);

  while (parsed.dir !== parsed.root) {
    paths.push(parsed.dir);
    parsed = parse(parsed.dir);
  }

  paths.push(parsed.root);

  return paths.map(directory => join(directory, 'node_modules'));
}

function resolveAsDir(filepath, mainFile = 'index.css') {
  const pkgfile = join(filepath, 'package.json');

  if (isFile(pkgfile)) {
    const body = readFileSync(pkgfile, 'utf8');

    try {
      const pkg = JSON.parse(body);

      if (pkg.main) return resolveAsFile(join(filepath, pkg.main)) ||
        resolveAsDir(join(filepath, pkg.main), mainFile);
    } catch (e) {} // eslint-disable-line no-empty
  }

  return resolveAsFile(join(filepath, mainFile));
}

function resolveAsFile(filepath, extensions = []) {
  if (isFile(filepath)) return filepath;

  for (let i = 0; i < extensions.length; ++i) {
    const extension = extensions[i];
    const file = filepath + extension;

    if (file === filepath) continue;
    if (isFile(file)) return file;
  }
}

function resolveModule(filepath, {cwd, resolve: resolvecfg = {}}) {
  const file = applyAliases(filepath, resolvecfg.alias);
  const dirs = isNodeModule(file)
    ? (resolvecfg.modules || []).concat(nodeModulesPaths(cwd))
    : (resolvecfg.modules || []).concat(cwd);

  for (let i = 0; i < dirs.length; ++i) {
    const directory = dirs[i];

    if (!isDirectory(directory)) continue;

    const abspath = resolve(directory, file);
    const result = resolveAsFile(abspath, resolvecfg.extensions) ||
      resolveAsDir(abspath, resolvecfg.mainFile);

    if (result) return result;
  }
}
