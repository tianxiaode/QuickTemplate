Ext.define('Common.Desktop.ux.button.QrCode',{
    extend: 'Ext.Button',
    xtype: 'uxqrcodebutton',

    cachedConfig:{
        iconCls: 'x-fa fa-qrcode',
    },
    config:{
        tooltip: I18N.ExportQrCode,
        ui: 'action',
    }
})