Ext.define('Common.mixin.button.Cancel', {
    extend: 'Common.mixin.Component',


    config: {
        cancelButton: null,
        cancelButtonDefaults: {
            langText: 'Cancel',
            mixinName: 'cancelButton',
            ui: 'grey',
            handler: 'onCancelButtonTap'
        }
    },

    applyCancelButton(config, old) {
        return Ext.updateWidget(old, config, this, 'getComponentConfig', 'cancelButtonDefaults');
    },

    updateCancelButton(config){
        config && this.add(config);
    }

});
