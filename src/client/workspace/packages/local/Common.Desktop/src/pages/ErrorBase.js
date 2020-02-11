Ext.define('Common.Desktop.pages.ErrorBase', {
    extend: 'Ext.Panel',

    requires: [
    ],

    zIndex: 800,
    fullscreen: true,
    modal: true,
    float: true,  

    controller: 'authentication',
    autoShow: true,
    cls: 'error-page-container',
    closable: false,
    title: I18N.AppTitle,
    titleAlign: 'center',
    closeAction: 'hide',
    hideMode: 'display',
    
    layout: {
        type: 'vbox',
        align: 'center',
        pack: 'center'
    }
});
