Ext.define('Common.shared.ux.button.Previous',{
    extend: 'Ext.Button',
    xtype: 'uxpreviousbutton',

    iconCls: 'x-fa fa-angle-left',
    config:{
        langTooltip: 'PrevPage',
    },

    isPaging: true,
    pagingName: 'prev',
    disabled: true,
    weight: 20,
    handler: 'onPagingMovePrevious'

})