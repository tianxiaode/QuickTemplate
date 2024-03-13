Ext.define('Common.mixin.button.Trash', {
    extend: 'Common.mixin.Component',

    config: {
        trashButton: null
    },

    createTrashButton(config) {
        return Ext.apply({
            xtype: 'button',
            ui: 'danger',
            langTooltip: 'Delete',
            iconCls: IconCls.delete,
            handler: 'onTrashButtonTap',
            isCrud: true,
            crudName: 'trash',
            weight: 300,
            ownerCmp: this
        }, config, this.getDefaults());

    },

    applyTrashButton(config, old) {
        return Ext.updateWidget(old, config, this, 'createTrashButton');
    },

    updateTrashButton(config) {
        config && this.add(config);
    },

    doDestroy() {
        this.destroyMembers('trashButton');
    }



})
