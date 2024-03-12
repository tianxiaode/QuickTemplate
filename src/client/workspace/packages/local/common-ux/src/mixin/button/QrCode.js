Ext.define('Common.mixin.button.QrCode', {
    extend: 'Common.mixin.Component',

    config: {
        qrCodeButton: null,
        qrCodeDefaults: {
            langTooltip: 'ExportQrCode',
            iconCls: IconCls.qrCode,
            handler: 'onQrCodeButtonTap',
            mixinName: 'qrCodeButton'
        }
    },

    applyQrCodeButton(config, old) {
        return Ext.updateWidget(old, config, this, 'getComponentConfig', 'qrCodeButtonDefaults');
    },

    updateQrCodeButton(config) {
        config && this.add(config);
    }

})
