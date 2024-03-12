Ext.define('Common.mixin.button.SaveAndNew', {
    extend: 'Common.mixin.Component',


    config: {
        saveAndNewButton: null,
        saveAndNewButtonDefaults: {
            ui: 'success',
            langText: 'SaveAndNew',
            handler: 'onSaveAndNewButtonTap',
            mixinName: 'saveAndNewButton'
        }
    },

    applySaveAndNewButton(config, old) {
        return Ext.updateWidget(old, config, this, 'getComponentConfig', 'saveAndNewButtonDefaults');
    },

    updateSaveAndNewButton(config) {
        config && this.add(config);
    }

});
