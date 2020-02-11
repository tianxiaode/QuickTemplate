Ext.define('Common.Desktop.ux.button.Import',{
    extend: 'Ext.Button',
    xtype: 'uximportbutton',

    cachedConfig:{
        iconCls: 'x-fa fa-upload',
    },
    config:{
        tooltip: I18N.Import,
        ui: 'action',
    }
})