Ext.define('Common.mixin.button.SaveAndNew', {
    extend: 'Common.mixin.Component',


    config: {
        saveAndNewButton: null
    },

    createSaveAndNewButton(config) {
        let me = this,
            handler = 'onSaveAndNewButtonTap';
        if(me[handler]) handler = me[handler].bind(me);
        return Ext.apply({
            xtype: 'button',
            ui: 'success',
            langText: 'SaveAndNew',
            handler: handler,
            ownerCmp: this
        }, config);
    },

    applySaveAndNewButton(config, old) {
        return Ext.updateWidget(old, config, this, 'createSaveAndNewButton');
    },

    updateSaveAndNewButton(config){
        config && this.add(config);
    },

    doDestroy(){
        this.destroyMembers('saveAndNewButton');
    }

});
