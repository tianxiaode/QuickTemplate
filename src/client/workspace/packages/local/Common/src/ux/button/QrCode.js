Ext.define('Common.ux.button.QrCode',{
    extend: 'Common.ux.button.Auto',
    xtype: 'uxqrcodebutton',


    applyLangTooltip(tip){
        if(tip !== 'auto') return tip;
        if(Ext.platformTags.desktop) return 'ExportQrCode';
        return null;
    },

    applyIconCls(cls){
        if(cls !== 'auto') return cls;
        return 'x-fa fa-qrcode';
    },

    applyUi(ui){
        if(ui !== 'auto') return ui;
        if(Ext.platformTags.desktop) return null;
        return 'plain';
    }

})