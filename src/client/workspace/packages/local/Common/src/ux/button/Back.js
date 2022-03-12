Ext.define('Common.ux.button.Back',{
    extend: 'Ext.Button',
    xtype: 'uxbackbutton',

    iconCls : 'md-icon-arrow-back',
    handler: 'onBack', 
    weight : -100,
    ui: 'plain'
})