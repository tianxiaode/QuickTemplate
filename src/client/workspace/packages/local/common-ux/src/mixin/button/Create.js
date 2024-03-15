Ext.define('Common.mixin.button.Create', {
    extend: 'Common.mixin.Component',

    config: {
        createButton: null
    },

    createCreateButton(config) {
        return Ext.apply({
            xtype: 'button',
            iconCls: IconCls.create,
            ui: 'success',
            handler: 'onCreateButtonTap',
            langTooltip: 'Add',
            isCrud: true,
            crudName: 'create',
            weight: 100,
            ownerCmp: this,
        }, config, this.getDefaults());
    },


    applyCreateButton(config, old) {
        return Ext.updateWidget(old, config, this, 'createCreateButton');
    },

    updateCreateButton(config) {
        config && this.add(config);
    },

    doDestroy() {
        this.destroyMembers('createButton');
    }



})
