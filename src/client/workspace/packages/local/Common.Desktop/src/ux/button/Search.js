Ext.define('Common.Desktop.ux.button.Search',{
    extend: 'Ext.Button',
    xtype: 'uxsearchbutton',

    cachedConfig:{
        iconCls: 'x-fa fa-search',
    },
    config:{
        tooltip: I18N.Search,
    }
})