Ext.define('Common.shared.ux.button.First',{
    extend: 'Ext.Button',
    xtype: 'uxfirstbutton',

    iconCls: 'x-fa fa-angle-double-left',
    config:{
        langTooltip: 'FirstPage',
    },

    isPaging: true,
    pagingName: 'first',
    disabled: true,
    weight: 10,
    handler: 'onPagingMoveFirst',

})