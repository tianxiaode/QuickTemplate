Ext.define('Common.shared.ux.button.Done',{
    extend: 'Ext.Button',
    xtype: 'uxdonebutton',

    iconCls : 'md-icon-done',
    ui: 'plain',
    weight: 200,
    handler: 'onDone' , 
})