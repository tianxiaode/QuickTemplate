Ext.define('Common.ux.menu.QueryScopeCheckItem',{
    extend: 'Ext.menu.CheckItem',
    xtype: 'uxqueryscopemenucheckitem',

    mixins:[
        'Common.mixin.QueryScope'
    ]
})