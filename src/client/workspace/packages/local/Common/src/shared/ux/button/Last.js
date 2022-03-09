Ext.define('Common.shared.ux.button.Last',{
    extend: 'Ext.Button',
    xtype: 'uxlastbutton',

    iconCls: 'x-fa fa-angle-double-right',
    config:{
        langTooltip: 'LastPage',
    },

    isPaging: true,
    pagingName: 'last',
    disabled: true,
    weight: 60,
    handler: 'onPagingMoveLast'

})