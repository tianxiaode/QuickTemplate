Ext.define('Common.shared.ux.button.Save',{
    extend: 'Ext.Button',
    xtype: 'uxsavebutton',

    langText: 'Save',
    langTooltip: 'Save',
    ui: 'action',
    
    phoneUi: 'plain',
    phoneWeight: 80,
    phoneIconCls: 'md-icon-done',


    handler: 'onSave'
})