Ext.define('Common.mixin.button.Import', {
    extend: 'Common.mixin.Component',

    config: {
        importButton: null,
        importButtonDefaults: {
            langTooltip: 'Import',
            iconCls: IconCls.history,
            handler: 'onImportButtonTap',
            mixinName: 'importButton'
        }
    },

    applyImportButton(config, old) {
        return Ext.updateWidget(old, config, this, 'getComponentConfig', 'importButtonDefaults');
    },

    updateImportButton(config) {
        config && this.add(config);
    }


})
