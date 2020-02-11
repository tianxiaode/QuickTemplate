Ext.define('Common.Desktop.ux.button.Create',{
    extend: 'Ext.Button',
    xtype: 'uxcreatebutton',

    cachedConfig:{
        iconCls: 'x-fa fa-file',
    },
    config:{
        tooltip: I18N.Add,
        ui: 'soft-green', 
    }
})