/*
 * This file launches the application by asking Ext JS to create
 * and launch() the Application class.
 */
Ext.application({
    extend: 'Phone.Application',

    name: 'Phone',

    requires: [
        // This will automatically load all classes in the Phone namespace
        // so that application classes do not need to require each other.
        'Phone.*'
    ],

    // The name of the initial view to create.
    mainView: 'Phone.view.main.Main'
});
