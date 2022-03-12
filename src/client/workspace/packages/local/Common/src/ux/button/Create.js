Ext.define('Common.ux.button.Create',{
    extend: 'Ext.Button',
    xtype: 'uxcreatebutton',

    hidden: true,
    handler: 'onCreate', 

    langTooltip: 'Add',

    ui: 'desktop',
    weight: 70,
    iconCls: 'x-fa fa-file text-success',
    
    phoneUi: 'plain',
    phoneWeight: 50,
    phoneIconCls: 'md-icon-add',

})