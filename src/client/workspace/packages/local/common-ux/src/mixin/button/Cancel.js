Ext.define('Common.mixin.button.Cancel', {
    extend: 'Common.mixin.Component',


    config: {
        cancelButton: null
    },

    createCancelButton(config) {
        return Ext.apply({
            xtype: 'button',
            langText: 'Cancel',
            ui: 'grey',
            handler: 'onCancelButtonTap',
            ownerCmp: this,
        }, config, this.getDefaults());
    },

    applyCancelButton(config, old) {
        return Ext.updateWidget(old, config, this, 'createCancelButton');
    },

    updateCancelButton(config) {
        config && this.add(config);
    },

    doDestroy(){
        this.destroyMembers('cancelButton');
    }


});
