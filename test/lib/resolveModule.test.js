'use strict';

const {
  applyAliases,
  isDirectory,
  isFile,
  isNodeModule,
  nodeModulesPaths,
  resolveAsDir,
  resolveAsFile,
  resolveModule,
} = require('../../lib/resolveModule');
const {parse, resolve} = require('path');

test('applyAliases', () => {
  expect(applyAliases('a')).toBe('a');
  expect(applyAliases('a', {a: 'b'})).toBe('b');
});

test('isDirectory', () => {
  expect(isDirectory(__dirname)).toBe(true);
  expect(isDirectory(`${__dirname}fake`)).toBe(false);
});

test('isFile', () => {
  expect(isFile(resolve(__dirname, 'resolveModule.test.js'))).toBe(true);
  expect(isFile(resolve(__dirname, 'fake.js'))).toBe(false);
});

test('isNodeModule', () => {
  expect(isNodeModule('.')).toBe(false);
  expect(isNodeModule('..')).toBe(false);
  expect(isNodeModule('../awesome.css')).toBe(false);
  expect(isNodeModule('./awesome.css')).toBe(false);
  expect(isNodeModule('/')).toBe(false);
  expect(isNodeModule('C:\\my-dir')).toBe(false);
  expect(isNodeModule('d:\\my-dir')).toBe(false);
  expect(isNodeModule('@sullenor/eslint-config')).toBe(true);
  expect(isNodeModule('lodash')).toBe(true);
  expect(isNodeModule('lodash/curry')).toBe(true);
});

test('nodeModulesPaths', () => {
  const parsed = parse(__dirname);
  const paths = nodeModulesPaths(__dirname);

  expect(paths[0]).toBe(resolve(__dirname, 'node_modules'));
  expect(paths[paths.length - 1]).toBe(resolve(parsed.root, 'node_modules'));
});

test('resolveAsDir', () => {
  expect(resolveAsDir(resolve(__dirname, 'node_modules/awesome')))
    .toBe(resolve(__dirname, 'node_modules/awesome/index.css'));
  expect(resolveAsDir(resolve(__dirname, 'node_modules/main')))
    .toBe(resolve(__dirname, 'node_modules/main/main.css'));
});

test('resolveAsFile', () => {
  expect(resolveAsFile(resolve(__dirname, 'node_modules/awesome/index'), ['.css']))
    .toBe(resolve(__dirname, 'node_modules/awesome/index.css'));
});

test('resolveModule', () => {
  expect(resolveModule('awesome', {cwd: __dirname}))
    .toBe(resolve(__dirname, 'node_modules/awesome/index.css'));
  expect(resolveModule('awesome/index.css', {cwd: __dirname}))
    .toBe(resolve(__dirname, 'node_modules/awesome/index.css'));
  expect(resolveModule('main', {cwd: __dirname}))
    .toBe(resolve(__dirname, 'node_modules/main/main.css'));
});
