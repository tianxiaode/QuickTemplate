Ext.define('Common.Desktop.ux.button.First',{
    extend: 'Ext.Button',
    xtype: 'uxfirstbutton',

    cachedConfig:{
        iconCls: 'x-fa fa-angle-double-left',
    },
    config:{
        tooltip: I18N.Paging.First,
    }
})