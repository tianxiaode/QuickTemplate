Ext.define('Common.shared.ux.button.Update',{
    extend: 'Ext.Button',
    xtype: 'uxupdatebutton',

    hidden: true,
    disabled:true,
    handler: 'onUpdate', 

    langTooltip: 'Edit',

    ui: 'defaults',
    weight: 80,
    iconCls: 'x-fa fa-edit',
    
    phoneUi: 'plain',
    phoneWeight: 60,
    phoneIconCls: 'md-icon-edit',

})