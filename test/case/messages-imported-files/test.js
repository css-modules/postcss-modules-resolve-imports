'use strict';

const setup = require('../../setup');
const path = require('path');

test('messages-imported-files', () => {
  let {messages} = setup(
    'values',
    'local-by-default',
    'extract-imports',
    'scope',
    'self'
  )(__dirname);

  messages = messages
    .filter(m => m.plugin === 'postcss-modules-resolve-imports');

  expect(messages).toEqual([
    {
      plugin: 'postcss-modules-resolve-imports',
      type: 'import',
      from: path.join(__dirname, 'lib/button/message.css'),
      file: path.join(__dirname, 'lib/color.css'),
      exports: {
        color: 'green',
      },
    },
    {
      plugin: 'postcss-modules-resolve-imports',
      type: 'import',
      from: path.join(__dirname, 'source.css'),
      file: path.join(__dirname, 'lib/button/message.css'),
      exports: {
        color: 'green',
        message: '_message_message',
      },
    },
    {
      plugin: 'postcss-modules-resolve-imports',
      type: 'import',
      from: path.join(__dirname, 'lib/button/button.css'),
      file: path.join(__dirname, 'lib/color.css'),
      exports: {
        color: 'green',
      },
    },
    {
      plugin: 'postcss-modules-resolve-imports',
      type: 'import',
      from: path.join(__dirname, 'source.css'),
      file: path.join(__dirname, 'lib/button/button.css'),
      exports: {
        color: 'green',
        button: '_button_button',
      },
    },
  ]);
});
