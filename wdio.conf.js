const EyesService = require('@applitools/eyes-webdriverio/dist/service');
const batchName = "NAB Eyes Service Device Issue";
const batchId = '1234'
const isVisualTest = true;

const {
  ScreenOrientation,
  DeviceName } = require('@applitools/eyes-webdriverio');

	exports.config = {

		runner: 'local',
		specs: [],
		// Patterns to exclude.
		exclude: [],
		maxInstances: 2,

		// Execution Cloud Capabilities
		capabilities: [
			{
				acceptInsecureCerts: true,
				browserName: 'chrome',
				"applitools:region": "australia",
				'goog:chromeOptions': {
                            args: [
                                '--no-sandbox',
                                '--disable-infobars',
                                '--disable-gpu',
                                // '--headless',
                                '--window-size=1440,900'
                            ],
                        }
			},],

        logLevel: 'trace',
        logLevels: { '@wdio/mocha-framework': 'trace' },
		enableEyesLogs: true,

		bail: 0,
		baseUrl: 'https://demo.applitools.com',
		waitforTimeout: 30000,
		connectionRetryTimeout: 90000,
		connectionRetryCount: 0,

		// Eyes as a Service
		services: [[EyesService, {
			useExecutionCloud: true,
//			proxy: proxyUrl? { url: proxyUrl } : undefined,
		 	useVisualGrid: true,
		 	viewportSize: {width: 1200, height: 800},
			//UFG concurrency
			concurrency: 20,
			batch: { 'name': batchName },
            browsersInfo: [
                        {width: 1200, height: 800, name: 'chrome'},
                        {width: 1200, height: 800, name: 'firefox'},
                        {width: 1200, height: 800, name: 'safari'},
                        {iosDeviceInfo: {
                            deviceName: "iPhone 14",
                        }},
                        {
                            chromeEmulationInfo: {
                            deviceName: DeviceName.iPhone_6_7_8,
                        }},
                        {
                            chromeEmulationInfo: {
                            deviceName: DeviceName.Galaxy_S9_Plus,
                            screenOrientation: ScreenOrientation.LANDSCAPE,
                        }},

	        ],
	        }]],

		    framework: 'mocha',
            reporters: ['spec'],
            mochaOpts: {
            ui: 'bdd',
            timeout: 60000
            },


        onPrepare: async function () {
        console.log("Inside onPrepare")
        },

        before: function (capabilities, specs) {
            console.log("Inside Before")
        },

		beforeTest: async function (test, context) {
        console.log("Inside BeforeTest")
			try {
				let applitoolsAppName = "NabWebsite";

				if (isVisualTest) {
					console.log('start eye visual test');
					try {
						const configuration =  await browser.eyesGetConfiguration();
						configuration.setAppName(applitoolsAppName);
						configuration.setTestName(scenario.name);
						await browser.eyesSetConfiguration(configuration);
					} catch (e) {
						console.log('Exception while setting Eyes Configuration', e);
					}
				}
				else {
					console.log('start non-eye test');

					try {
						const testName = scenario.name;
						console.log("testName: " + testName);
						const appName = applitoolsAppName;
						await browser.execute('applitools:startTest', { 'testName' : testName, 'appName' : appName});
					}
					catch (e) {
						console.log('applitools:startTest error: ' + e);
					}
				}
			} catch (e) {
				console.log("Error happen in beforeScenario");
			}
		},

		afterTest: async function (test, context, { error, result, duration, passed, retries }) {
			try {
				if (isVisualTest) {
					const testResults = await browser.eyesGetTestResults();

					// example for using the testResults -
					// fail the test if visual differences were found
					if ((await testResults).getStatus() !== 'Passed') {
						const testName = `'${testResults.getName()}' of '${testResults.getAppName()}'`
						throw new Error(`Test ${testName} detected differences! See details at: ${testResults.getUrl()}`)
					}
				}
				else
				{
					console.log('Run applitools end test');
					try {
						await browser.execute("applitools:endTest", {'status' : result.status});
					} catch (e) {
						console.log("applitools:endTest for non-eyes tests error: " + e);
					}
				}
			}
			catch (e) {
				console.log("Fail to run afterScenario: " + e);
			}
		},

//		onComplete: async function () {
//
//		},
	}
