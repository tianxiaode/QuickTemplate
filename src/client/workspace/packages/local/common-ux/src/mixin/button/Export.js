Ext.define('Common.mixin.button.Export', {
    extend: 'Common.mixin.Component',

    config: {
        exportButton: null,
        exportButtonDefaults: {
            langTooltip: 'Export',
            iconCls: IconCls.export,
            handler: 'onExportButtonTap',
            mixinName: 'exportButton'

        }
    },

    applyExportButton(config, old) {
        return Ext.updateWidget(old, config, this, 'getComponentConfig', 'exportButtonDefaults');
    },

    updateExportButton(config) {
        config && this.add(config);
    }

})
