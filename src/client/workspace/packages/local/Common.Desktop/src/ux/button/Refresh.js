Ext.define('Common.Desktop.ux.button.Refresh',{
    extend: 'Ext.Button',
    xtype: 'uxrefreshbutton',

    cachedConfig:{
        iconCls: 'x-fa fa-sync-alt',
    },
    config:{
        tooltip: I18N.Refresh,
        ui: 'soft-cyan',    
    }
})