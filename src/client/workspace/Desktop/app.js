/*
 * This file launches the application by asking Ext JS to create
 * and launch() the Application class.
 */
Ext.application({
    extend: 'Desktop.Application',

    name: 'Desktop',

    requires: [
        // This will automatically load all classes in the Desktop namespace
        // so that application classes do not need to require each other.
        'Desktop.*'
    ],

    // The name of the initial view to create.
    mainView: 'Desktop.view.main.Main'
});
