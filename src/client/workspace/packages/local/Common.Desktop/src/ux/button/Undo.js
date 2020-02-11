Ext.define('Common.Desktop.ux.button.Undo',{
    extend: 'Ext.Button',
    xtype: 'uxundobutton',

    cachedConfig:{
        iconCls: 'x-fa fa-undo',
    },
    config:{
        tooltip: I18N.CancelSearch,
    }
})