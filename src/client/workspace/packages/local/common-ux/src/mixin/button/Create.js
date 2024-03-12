Ext.define('Common.mixin.button.Create', {
    extend: 'Common.mixin.Component',

    config: {
        createButton: null,
        createButtonDefaults: {
            iconCls: IconCls.create,
            mixinName: 'createButton',
            ui: 'success',
            handler: 'onCreateButtonTap',
            langTooltip: 'Add'            
        },
    },

    applyCreateButton(config, old) {
        return Ext.updateWidget(old, config, this, 'getComponentConfig', 'createButtonDefaults');
    },

    updateCreateButton(config){
        config && this.add(config);
    }


})
