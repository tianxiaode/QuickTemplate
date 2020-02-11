Ext.define('Common.Desktop.ux.button.Cancel',{
    extend: 'Ext.Button',
    xtype: 'uxcancelbutton',

    config:{
        text: I18N.Cancel,
        tooltip: I18N.Cancel,
        ui: 'soft-grey', 
    }
})