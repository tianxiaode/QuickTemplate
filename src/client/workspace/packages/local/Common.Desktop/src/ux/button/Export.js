Ext.define('Common.Desktop.ux.button.Export',{
    extend: 'Ext.Button',
    xtype: 'uxexportbutton',

    cachedConfig:{
        iconCls: 'x-fa fa-download',
    },
    config:{
        tooltip: I18N.Export,
        ui: 'action',
    }
})