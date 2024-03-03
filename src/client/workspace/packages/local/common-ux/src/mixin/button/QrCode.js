Ext.define('Common.mixin.button.QrCode', {
    extend: 'Common.mixin.Component',

    config: {
        qrCodeButton: null
    },

    createQrCodeButton(config) {
        let me = this,
            handler = 'onQrCodeButtonTap';
        if(me[handler]) handler = me[handler].bind(me);
        return Ext.apply({
            xtype: 'button',
            langTooltip: 'ExportQrCode',
            iconCls: 'x-fa fa-qrcode',
            handler: handler,
            ownerCmp: me
        }, config);
    },

    applyQrCodeButton(config, old) {
        return Ext.updateWidget(old, config, this, 'createQrCodeButton');
    },

    updateQrCodeButton(config){
        config && this.add(config);
    },


    doDestroy(){
        this.destroyMembers( 'qrCodeButton');
    }


})
