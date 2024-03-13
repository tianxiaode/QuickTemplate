Ext.define('Common.mixin.button.QrCode', {
    extend: 'Common.mixin.Component',

    config: {
        qrCodeButton: null
    },

    createQrCodeButton(config) {
        return Ext.apply({
            xtype: 'button',
            iconCls: IconCls.qrCode,
            handler: 'onQrCodeButtonTap',
            ownerCmp: this            
        }, config, this.getDefaults());
    },

    applyQrCodeButton(config, old) {
        return Ext.updateWidget(old, config, this, 'createQrCodeButton');
    },

    updateQrCodeButton(config) {
        config && this.add(config);
    },

    doDestroy(){
        this.destroyMembers('qrCodeButton');
    }


})
