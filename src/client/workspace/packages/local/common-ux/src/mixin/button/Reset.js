Ext.define('Common.mixin.button.Reset', {
    extend: 'Common.mixin.Component',

    config: {
        resetButton: null,
        resetButtonDefaults: {
            ui: 'grey',
            langTooltip: 'Reset',
            iconCls: IconCls.undo,
            handler: 'onResetButtonTap',
            mixinName: 'resetButton'
        }
    },

    applyResetButton(config, old) {
        return Ext.updateWidget(old, config, this, 'getComponentConfig', 'resetButtonDefaults');
    },

    updateResetButton(config) {
        config && this.add(config);
    }


})
