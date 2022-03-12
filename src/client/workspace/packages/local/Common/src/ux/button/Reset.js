Ext.define('Common.ux.button.Reset',{
    extend: 'Ext.Button',
    xtype: 'uxresetbutton',

    langText: 'Reset',
    langTooltip: 'Reset',
    ui: 'soft-purple', 
    iconCls: 'desktop',
    weight: 60,

    phoneUi: 'plain',
    phoneIconCls: 'md-icon-undo',
    phoneWeight: 60,

    handler: 'onReset'
})