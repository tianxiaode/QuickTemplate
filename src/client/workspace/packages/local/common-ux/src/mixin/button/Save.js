Ext.define('Common.mixin.button.Save', {
    extend: 'Common.mixin.Component',


    config: {
        saveButton: null
    },

    createSaveButton(config) {
        let me = this,
            handler = 'onSaveButtonTap';
        if(me[handler]) handler = me[handler].bind(me);
        return Ext.apply({
            xtype: 'button',
            ui: 'success',
            langText: 'Save',
            handler: handler,
            ownerCmp: me
        }, config);
    },

    applySaveButton(config, old) {
        return Ext.updateWidget(old, config, this, 'createSaveButton');
    },

    updateSaveButton(config){
        config && this.add(config);
    },

    doDestroy(){
        this.destroyMembers('saveButton');
    }

});
