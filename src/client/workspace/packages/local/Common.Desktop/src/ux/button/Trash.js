Ext.define('Common.Desktop.ux.button.Trash',{
    extend: 'Ext.Button',
    xtype: 'uxtrashbutton',

    cachedConfig:{
        iconCls: 'x-fa fa-trash',
    },
    config:{
        tooltip: I18N.Delete,
        ui: 'soft-red',    
    }
})