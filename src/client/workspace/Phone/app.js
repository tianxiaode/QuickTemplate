/*
 * This file launches the application by asking Ext JS to create
 * and launch() the Application class.
 */
Ext.application({
    extend: 'Common.ux.app.Application',

    name: 'Phone',

    defaultToken: 'phonedashboard',

    requires:[
        'Common.overrides.shared.*',
        'Common.overrides.phone.*',
        'Phone.view.home.Home'
    ],

});
