Ext.define('Common.mixin.button.Cancel', {
    extend: 'Common.mixin.Component',


    config: {
        cancelButton: {}
    },

    createCancelButton(config) {
        let me = this,
            handler = 'onCancelButtonTap';
        if(me[handler]) handler = me[handler].bind(me);
        return Ext.apply({
            xtype: 'button',
            langText: 'Cancel',
            ui: 'grey',
            handler: handler,
            ownerCmp: me
        }, config);
    },

    applyCancelButton(config, old) {
        return Ext.updateWidget(old, config, this, 'createCancelButton');
    },

    updateCancelButton(config){
        config && this.add(config);
    },

    doDestroy(){
        this.destroyMembers('cancelButton');
    }

});
