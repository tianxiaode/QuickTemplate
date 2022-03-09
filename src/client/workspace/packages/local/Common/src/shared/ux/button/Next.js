Ext.define('Common.shared.ux.button.Next',{
    extend: 'Ext.Button',
    xtype: 'uxnextbutton',

    iconCls: 'x-fa fa-angle-right',
    config:{
        langTooltip: 'NextPage',
    },

    disabled: true,
    isPaging: true,
    pagingName: 'next',
    weight: 50,
    handler: 'onPagingMoveNext'

})