Ext.define('Common.ux.field.trigger.Refresh',{
    extend: 'Ext.field.trigger.Trigger',
    xtype: 'refreshtrigger',
    alias: 'trigger.refresh',

    classCls: Ext.baseCSSPrefix + 'refresh-trigger',


    weight: -1000,
    //hidden: true,
    //handler: 'onRefreshIconTap',
    scope: 'this'    
})