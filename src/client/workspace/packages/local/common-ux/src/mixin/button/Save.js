Ext.define('Common.mixin.button.Save', {
    extend: 'Common.mixin.Component',


    config: {
        saveButton: null,
        saveButtonDefaults: {
            xtype: 'button',
            ui: 'success',
            langText: 'Save',
            handler: 'onSaveButtonTap',
            mixinName: 'saveButton'
        }
    },

    applySaveButton(config, old) {
        return Ext.updateWidget(old, config, this, 'getComponentConfig', 'saveButtonDefaults');
    },

    updateSaveButton(config) {
        config && this.add(config);
    }

});
