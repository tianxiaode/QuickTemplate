Ext.define('Common.mixin.button.Done', {
    extend: 'Common.mixin.Component',

    config: {
        doneButton: null,
        doneButtonDefaults: {
            ui: 'plain',
            iconCls: IconCls.done,
            handler: 'onDoneButtonTap',
            mixinName: 'doneButton'
        }
    },

    applyDoneButton(config, old) {
        return Ext.updateWidget(old, config, this, 'getComponentConfig', 'doneButtonDefaults');
    },

    updateDoneButton(config){
        config && this.add(config);
    }

})
