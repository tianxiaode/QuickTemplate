Ext.define('Common.Desktop.ux.button.Last',{
    extend: 'Ext.Button',
    xtype: 'uxlastbutton',

    cachedConfig:{
        iconCls: 'x-fa fa-angle-double-right',
    },
    config:{
        tooltip: I18N.Paging.Last,
    }
})