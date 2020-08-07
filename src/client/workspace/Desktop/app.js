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
        'Common.shared.util.Url',
        'Common.shared.util.TemplateFn',
        'Common.shared.service.OAuth',
        'Common.shared.service.Config',
        'Common.shared.view.authentication.Login',
        'Common.shared.view.authentication.SelectOrganizationUnit',
        'Desktop.view.home.HomeView', 
    ],


    // The name of the initial view to create.
});
