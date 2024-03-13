Ext.define('Common.mixin.button.Reset', {
    extend: 'Common.mixin.Component',

    config: {
        resetButton: null
    },

    createResetButton(config) {
        return Ext.apply({
            xtype: 'button',
            ui: 'grey',
            langTooltip: 'ResetSearchValue',
            iconCls: IconCls.undo,
            handler: 'onResetButtonTap',
            isCrud: true,
            crudName: 'reset',
            weight: 800,
            ownerCmp: this
        }, config, this.getDefaults());
        
    },

    applyResetButton(config, old) {
        return Ext.updateWidget(old, config, this, 'createResetButton');
    },

    updateResetButton(config) {
        config && this.add(config);
    },

    doDestroy(){
        this.destroyMembers('resetButton');
    }

})
