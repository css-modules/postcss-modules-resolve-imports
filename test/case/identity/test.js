'use strict';

const setup = require('../../setup');

test('identity', () => {
  const {resulting} = setup()(__dirname);

  expect(resulting).toMatchSnapshot();
});
