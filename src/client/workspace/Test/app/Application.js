/**
 * The main application class. An instance of this class is created by app.js when it
 * calls Ext.application(). This is the ideal place to handle application launch and
 * initialization details.
 */
Ext.define('Test.Application', {
    extend: 'Ext.app.Application',

    requires: [
        'Common.overrides.*',
        'Common.core.*',
        'Common.localized.*'
    ],

    name: 'Test',

    quickTips: false,
    platformConfig: {
        desktop: {
            quickTips: true
        }
    },

    launch(){
        document.body.parentNode.classList = '';
        document.body.style.overflow = 'auto';
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
