Ext.define('Common.Desktop.ux.button.Previous',{
    extend: 'Ext.Button',
    xtype: 'uxpreviousbutton',

    cachedConfig:{
        iconCls: 'x-fa fa-angle-left',
    },
    config:{
        tooltip: I18N.Paging.Prev,
    }
})