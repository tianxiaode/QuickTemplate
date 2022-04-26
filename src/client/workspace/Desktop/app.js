/*
 * This file launches the application by asking Ext JS to create
 * and launch() the Application class.
 */
Ext.application({
    extend: 'Common.ux.app.Application',

    name: 'Desktop',

    defaultToken: 'dashboardview',

    requires:[
        'Common.overrides.shared.*',
        'Common.overrides.desktop.*',
        'Common.service.Storage',
        'Common.service.Url',
        'Common.service.HttpClient',
        'Common.service.Localized',
        'Common.service.Config',
        'Common.service.OAuth',
        'Common.util.TemplateFn',
        'Desktop.view.home.HomeView'
    ],


    // The name of the initial view to create.
});
