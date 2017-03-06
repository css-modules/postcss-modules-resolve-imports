CSS Modules: Resolve Imports
============================


Transforms:

```css
:import("library/button.css") {
  i__imported_button_0: button;
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

Should be used after [postcss-modules-scope](https://github.com/css-modules/postcss-modules-scope).


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


## Reference Guides

- Interoperable CSS: https://github.com/css-modules/icss
- NodeJS modules resolving mechanism: https://nodejs.org/dist/latest-v6.x/docs/api/modules.html#modules_all_together


## License

> The MIT License
