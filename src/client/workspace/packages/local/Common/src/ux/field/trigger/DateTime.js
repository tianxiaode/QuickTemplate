Ext.define('Common.ux.field.trigger.DateTime',{
    extend: 'Ext.field.trigger.Trigger',
    xtype: 'datetimetrigger',
    alias: 'trigger.datetime',
    classCls: Ext.baseCSSPrefix + 'dateTime-trigger',
    isExpandTrigger: true,
    handler: 'onExpandTap',
    scope: 'this'    
})