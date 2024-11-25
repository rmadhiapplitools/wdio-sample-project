'use strict';

const { remote } = require('webdriverio');
const { Eyes,
  ClassicRunner,
  VisualGridRunner,
  RunnerOptions,
  Target,
  RectangleSize,
  Configuration,
  BatchInfo,
  BrowserType,
  ScreenOrientation,
  DeviceName } = require('@applitools/eyes-webdriverio');

describe('ACME Bank', function () {

  it('should log into a bank account Demo', async () => {

    await browser.url('https://demo.applitools.com');

    // Verify the full login page loaded correctly.
    await browser.eyesCheck("Login page",Target.window().fully());

  });

});
