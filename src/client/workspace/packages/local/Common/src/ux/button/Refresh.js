Ext.define('Common.ux.button.Refresh',{
    extend: 'Ext.Button',
    xtype: 'uxrefreshbutton',


    handler: 'onRefreshStore', 
    isPaging: true,
    pagingName: 'Refresh',

    langTooltip: 'Refresh',

    ui: 'soft-cyan',
    weight: 200,
    iconCls: 'x-fa fa-undo',
    
    phoneUi: 'plain',
    phoneWeight: 80,
    phoneIconCls: 'md-icon-refresh',


})