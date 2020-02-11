Ext.define('Common.Desktop.ux.button.Edit',{
    extend: 'Ext.Button',
    xtype: 'uxeditbutton',

    cachedConfig:{
        iconCls: 'x-fa fa-edit',
    },
    config:{
        tooltip: I18N.Edit,
        ui: 'soft-blue', 
    }
})