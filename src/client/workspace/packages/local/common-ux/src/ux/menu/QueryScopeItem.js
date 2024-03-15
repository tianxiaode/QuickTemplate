Ext.define('Common.ux.menu.QueryScopeItem',{
    extend: 'Ext.menu.Item',
    xtype: 'uxqueryscopemenuitem',

    mixins:[
        'Common.mixin.QueryScope'
    ]
})