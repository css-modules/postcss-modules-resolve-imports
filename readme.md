CSS Modules: Resolve Imports
============================


Transforms:

```css
:import("library/button.css") {
  i__imported_button_0: button;
}
:export {
  continueButton: _source_continueButton i__imported_button_0;
}
._source_continueButton {
  color: green;
}
```

into:

```css
:export {
  continueButton: _source_continueButton _button_button
}
._button_button {
  /*common button styles*/
}
._source_continueButton {
  color: green
}
```

**Note**: should be used after [postcss-modules-extract-imports](https://github.com/css-modules/postcss-modules-extract-imports) and [postcss-modules-scope](https://github.com/css-modules/postcss-modules-scope).

The `postcss-moduels-resolve-imports` plugin also fixes `@import` and `url()` paths (which doesn't start from `/`) for the included modules from the different folders.


## Options

`icssExports` `boolean`

Adds the `:export` declaration to the resulting css. In case you need the JavaScript object with tokens, you may obtain it by accessing the `lazyResult.root.exports` property. For example,

```javascript
const lazyResult = postcss([...plugins]).process(cssString, {from: filepath});
const tokens = lazyResult.root.exports;
```


`resolve` `object`

Configure how modules should be resolved.


`resolve.alias` `object`

Create an aliases for the modules paths. For example, create an alias for the *lib* directory with common modules:

```javascript
alias: {
  lib: path.resolve(__dirname, 'lib'),
},
```

Now, instead of using relative paths when composing:

```css
.button {
  composes: normal from '../../lib/button.css';
}
```

you can use the alias:

```css
.button {
  composes: normal from 'lib/button.css';
}
```


`resolve.extensions` `array`

Automaticaly check files with the provided extensions.

```javascript
['.css']
```

Allows you to omit file extensions while using compose:

```css
.button {
  composes: normal from '../lib/button';
}
```


`resolve.modules` `array`

Provide additional directories to check the modules in. Should be absolute paths only.

```javascript
[path.resolve(__dirname, 'lib')]
```


`resolve.mainFile` `string`

Specifies the default filename to be used while resolving directories. Default: `index.css`.


`resolve.preserveSymlinks` `boolean`

Wether to resolve symlinks in paths. Defaults to nodejs behaviour: `false`, 
(parsed from `--preserve-symlinks` or environment variable `PRESERVE_SYMLINKS`).

## Messages

This plugin passes `result.messages` for each imported file.

```css
@value color from "./lib/colors.css";

.myButton {
  composes: button from './lib/button/button.css';
  background-color: color;
}
```

will output:

```js
[
    {
        plugin: 'postcss-modules-resolve-imports',
        type: 'import',
        from: '/foo/bar/lib/button/button.css'
        file: '/foo/bar/lib/color.css',
        exports: {
          // variable
          color: 'green',
        },
    },
    {
        plugin: 'postcss-modules-resolve-imports',
        type: 'import',
        from: '/foo/bar/source.css',
        file: '/foo/bar/lib/button/button.css',
        exports: {
          // variable from colors.css
          color: 'green',
          // local scoped classname from button.css
          button: '_button_button',
        },
    },
]
```

You can get access to this variables in `result.messages` also
in any plugin goes after `postcss-modules-resolve-imports`.

## Reference Guides

- Interoperable CSS: https://github.com/css-modules/icss
- NodeJS modules resolving mechanism: https://nodejs.org/dist/latest-v6.x/docs/api/modules.html#modules_all_together


## License

> The MIT License
