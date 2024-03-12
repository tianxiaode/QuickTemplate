Ext.define('Common.mixin.button.Update', {
    extend: 'Common.mixin.Component',

    config: {
        updateButton: null,
        updateButtonDefaults: {
            langTooltip: 'Edit',
            iconCls: IconCls.update,
            handler: 'onUpdateButtonTap',
            mixinName: 'updateButton'

        }
    },

    applyUpdateButton(config, old) {
        return Ext.updateWidget(old, config, this, 'getComponentConfig', 'updateButtonDefaults');
    },

    updateUpdateButton(config){
        config && this.add(config);
    }

})
