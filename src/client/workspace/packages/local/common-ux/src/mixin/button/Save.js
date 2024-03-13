Ext.define('Common.mixin.button.Save', {
    extend: 'Common.mixin.Component',


    config: {
        saveButton: null
    },

    createSaveButton(config) {
        return Ext.apply({
            xtype: 'button',
            ui: 'success',
            langText: 'Save',
            handler: 'onSaveButtonTap',
            ownerCmp: this,
        }, config, this.getDefaults());        
    },

    applySaveButton(config, old) {
        return Ext.updateWidget(old, config, this, 'createSaveButton');
    },

    updateSaveButton(config) {
        config && this.add(config);
    },

    doDestroy(){
        this.destroyMembers('saveButton');
    }

});
