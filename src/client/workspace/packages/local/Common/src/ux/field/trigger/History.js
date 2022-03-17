Ext.define('Common.ux.field.trigger.History',{
    extend: 'Ext.field.trigger.Trigger',
    xtype: 'historytrigger',
    alias: 'trigger.history',

    classCls: Ext.baseCSSPrefix + 'history-trigger',


    weight: -1000,
    //hidden: true,
    handler: 'onHistoryIconTap',
    scope: 'this'    
})