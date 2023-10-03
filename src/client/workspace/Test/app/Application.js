/**
 * The main application class. An instance of this class is created by app.js when it
 * calls Ext.application(). This is the ideal place to handle application launch and
 * initialization details.
 */
Ext.define('Test.Application', {
    extend: 'Ext.app.Application',

    requires: [
        'Common.*',
    ],

    name: 'Test',

    quickTips: false,
    platformConfig: {
        desktop: {
            quickTips: true
        }
    },

    launch() {
        let me = this;
        Ext.defer(me.startTest, 50, me);
    },

    startTest() {
        this.runTest(Ext.ClassManager.lookupName('Test.spec'));
        this.setEnv();

    },

    runTest(tests) {

        Object.keys(tests).forEach(k => {
            let value = tests[k],
                classname = value.$className;
            if (classname) {
                Ext.create(classname);
            } else {
                this.runTest(value);
            }
        });
    },

    setEnv() {
        const env = jasmine.getEnv();

        /**
         * ## Runner Parameters
         *
         * More browser specific code - wrap the query string in an object and to allow for getting/setting parameters from the runner user interface.
         */

        const queryString = new jasmine.QueryString({
            getWindowLocation: function () {
                return window.location;
            }
        });

        const filterSpecs = !!queryString.getParam('spec');

        const config = {
            stopOnSpecFailure: queryString.getParam('stopOnSpecFailure'),
            stopSpecOnExpectationFailure: queryString.getParam(
                'stopSpecOnExpectationFailure'
            ),
            hideDisabled: queryString.getParam('hideDisabled')
        };

        const random = queryString.getParam('random');

        if (random !== undefined && random !== '') {
            config.random = random;
        }

        const seed = queryString.getParam('seed');
        if (seed) {
            config.seed = seed;
        }

        /**
         * ## Reporters
         * The `HtmlReporter` builds all of the HTML UI for the runner page. This reporter paints the dots, stars, and x's for specs, as well as all spec names and all failures (if any).
         */
        const htmlReporter = new jasmine.HtmlReporter({
            env: env,
            navigateWithNewParam: function (key, value) {
                return queryString.navigateWithNewParam(key, value);
            },
            addToExistingQueryString: function (key, value) {
                return queryString.fullStringWithNewParam(key, value);
            },
            getContainer: function () {
                return document.body;
            },
            createElement: function () {
                return document.createElement.apply(document, arguments);
            },
            createTextNode: function () {
                return document.createTextNode.apply(document, arguments);
            },
            timer: new jasmine.Timer(),
            filterSpecs: filterSpecs
        });

        /**
         * The `jsApiReporter` also receives spec results, and is used by any environment that needs to extract the results  from JavaScript.
         */
        env.addReporter(jsApiReporter);
        env.addReporter(htmlReporter);

        /**
         * Filter which specs will be run by matching the start of the full name against the `spec` query param.
         */
        const specFilter = new jasmine.HtmlSpecFilter({
            filterString: function () {
                return queryString.getParam('spec');
            }
        });

        config.specFilter = function (spec) {
            return specFilter.matches(spec.getFullName());
        };

        env.configure(config);

        htmlReporter.initialize();
        env.execute();

    },



    onAppUpdate: function () {
        Ext.Msg.confirm('Application Update', 'This application has an update, reload?',
            function (choice) {
                if (choice === 'yes') {
                    window.location.reload();
                }
            }
        );
    }
});
