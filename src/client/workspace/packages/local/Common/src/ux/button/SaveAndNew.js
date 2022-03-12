Ext.define('Common.ux.button.SaveAndNew',{
    extend: 'Ext.Button',
    xtype: 'uxsaveandnewbutton',

    langText: 'SaveAndNew',
    langTooltip: 'SaveAndNew',
    ui: 'action',
    weight: 85,
    iconCls: 'desktop',
    
    phoneUi: 'plain',
    phoneWeight: 70,
    phoneIconCls: 'md-icon-add',

    handler: 'onSaveAndNew'
})