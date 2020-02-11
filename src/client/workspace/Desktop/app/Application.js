/**
 * The main application class. An instance of this class is created by app.js when it
 * calls Ext.application(). This is the ideal place to handle application launch and
 * initialization details.
 */
Ext.define('Desktop.Application', {
    extend: 'Common.Shared.Application',

    name: 'Desktop',

    quickTips: false,
    platformConfig: {
        desktop: {
            quickTips: true
        }
    },

    requires: [
        'Ext.MessageBox',
        'Common.Overrides.shared.*',
        'Common.Overrides.desktop.*',
        'Common.Shared.util.Config',
        'Common.Shared.util.Url',
        'Common.Shared.util.AccessControl',
        'Common.Shared.util.DialogManager',
        'Common.Shared.util.Failed',
        'Common.Shared.util.Headers',
        'Common.Shared.util.SignalR',
        'Common.Shared.util.Download',
        'Common.Shared.util.Enums',
        'Desktop.view.home.HomeView',
        'Common.Desktop.viewport.ViewportController',
        'Common.Desktop.pages.*',
        'Common.Desktop.authentication.*',
        'Common.Desktop.ux.Toast',
    ],

    stores: [
        'Common.Data.store.NavigationTree',
        'Common.Data.store.Enums',
    ],


    launch: function(profile) {
        Ext.ariaWarn = Ext.emptyFn;
        Ext.Viewport.getController().onLaunch();
    },

});
