/*
 * This file launches the application by asking Ext JS to create
 * and launch() the Application class.
 */
Ext.application({
    extend: 'Common.app.Application',

    name: 'Desktop',

    defaultToken: 'dashboard',

    requires:[
        'Desktop.view.home.HomeView'
    ],


    // The name of the initial view to create.
});
