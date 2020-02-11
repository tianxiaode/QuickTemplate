/**
 * 执行本地化重写
 */
Ext.onReady(function(){
    I18N.init(Ext.manifest.profile);
});

/*
 * This file launches the application by asking Ext JS to create
 * and launch() the Application class.
 */
Ext.application({
    extend: 'Desktop.Application',

    name: 'Desktop',


    // The name of the initial view to create.
});
