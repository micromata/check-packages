'use strict';

/* eslint-disable no-console, no-empty-function */
const noop = () => {};

const muteLogging = () => {
  console.info = noop;
  console.log = noop;
  console.error = noop;
  console.warn = noop;
  console.debug = noop;
};

// comment this out if you want to show log-messages inside tests, maybe for debugging purposes…
muteLogging();
