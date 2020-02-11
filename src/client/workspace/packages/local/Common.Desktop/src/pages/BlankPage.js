Ext.define('Common.Desktop.pages.BlankPage', {
    extend: 'Ext.Panel',
    xtype: 'pageblank',

    requires: [
    ],

    zIndex: 800,
    fullscreen: true,
    modal: true,
    float: true,  

    anchor : '100% -1',

    layout:{
        type:'vbox',
        pack:'center',
        align:'center'
    },

    items: [
        {
            xtype: 'component',
            cls: 'blank-page-container',
            html: '<div class=\'fa-outer-class\'><span class=\'x-fa fa-clock-o\'></span></div><h1>' + I18N.ComingSoon + '</h1><span class=\'blank-page-text\'>' + I18N.StayTunedForUpdates + '</span>'
        }
    ]
});
