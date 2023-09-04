Ext.define('Common.ux.button.QrCode',{
    extend: 'Ext.Button',
    xtype: 'uxqrcodebutton',

    langTooltip: 'ExportQrCode',
    iconCls: 'x-fa fa-qrcode',
    
    responsiveConfig:{
        'phone && !cancel':{
            ui: 'plain',
        }
    }


})