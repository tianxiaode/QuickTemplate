Ext.define('Common.mixin.button.Trash', {
    extend: 'Common.mixin.Component',

    config: {
        trashButton: null,
        trashButtonDefaults: {
            ui: 'danger',
            langTooltip: 'Delete',
            iconCls: IconCls.delete,
            handler: 'onTrashButtonTap',
            mixinName: 'trashButton'
        }
    },

    applyTrashButton(config, old) {
        return Ext.updateWidget(old, config, this, 'getComponentConfig', 'trashButtonDefaults');
    },

    updateTrashButton(config) {
        config && this.add(config);
    }


})
