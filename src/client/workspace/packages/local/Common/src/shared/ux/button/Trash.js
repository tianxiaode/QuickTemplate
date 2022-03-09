Ext.define('Common.shared.ux.button.Trash',{
    extend: 'Ext.Button',
    xtype: 'uxtrashbutton',

    hidden: true,
    disabled:true,
    handler: 'onDelete',

    langTooltip: 'Delete',

    ui: 'soft-red',
    weight: 90,
    iconCls: 'x-fa fa-trash',
    
    phoneUi: 'plain',
    phoneWeight: 70,
    phoneIconCls: 'md-icon-delete',



})