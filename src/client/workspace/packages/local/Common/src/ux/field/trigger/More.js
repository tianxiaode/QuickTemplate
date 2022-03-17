Ext.define('Common.ux.field.trigger.More',{
    extend: 'Ext.field.trigger.Trigger',
    xtype: 'moretrigger',
    alias: 'trigger.more',
    classCls: Ext.baseCSSPrefix + 'more-trigger',
    weight: -1000,
    hidden: true,
    handler: 'onMoreIconTap',
    scope: 'this'    
})