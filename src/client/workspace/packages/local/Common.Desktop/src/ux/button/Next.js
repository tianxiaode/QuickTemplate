Ext.define('Common.Desktop.ux.button.Next',{
    extend: 'Ext.Button',
    xtype: 'uxnextbutton',

    cachedConfig:{
        iconCls: 'x-fa fa-angle-right',
    },
    config:{
        tooltip: I18N.Paging.Next,
    }
})