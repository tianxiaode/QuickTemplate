/*
 * This file launches the application by asking Ext JS to create
 * and launch() the Application class.
 */
Ext.application({
    extend: 'Common.desktop.app.Application',

    name: 'Desktop',

    defaultToken: 'admindashboard',

    requires:[
        'Common.overrides.shared.*',
        'Common.overrides.desktop.*',
        'Common.util.Url',
        'Common.util.TemplateFn',
        'Common.service.OAuth',
        'Common.service.Config',
        'Common.view.authentication.Login',
        'Common.view.authentication.SelectOrganizationUnit',
        'Desktop.view.home.HomeView', 
    ],


    // The name of the initial view to create.
});
