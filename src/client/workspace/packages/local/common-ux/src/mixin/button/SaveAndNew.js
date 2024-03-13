Ext.define('Common.mixin.button.SaveAndNew', {
    extend: 'Common.mixin.Component',


    config: {
        saveAndNewButton: null
    },

    createSaveAndNewButton(config) {
        return Ext.apply({
            xtype: 'button',
            ui: 'success',
            langText: 'SaveAndNew',
            handler: 'onSaveAndNewButtonTap',
            owenCmp: this
        }, config, this.getDefaults())
    },

    applySaveAndNewButton(config, old) {
        return Ext.updateWidget(old, config, this, 'createSaveAndNewButton');
    },

    updateSaveAndNewButton(config) {
        config && this.add(config);
    },

    doDestroy() {
        this.destroyMembers('saveAndNewButton');
    }


});
