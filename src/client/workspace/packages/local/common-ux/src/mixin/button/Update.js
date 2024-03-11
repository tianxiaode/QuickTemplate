Ext.define('Common.mixin.button.Update', {
    extend: 'Common.mixin.Component',

    config: {
        updateButton: null
    },

    createUpdateButton(config) {
        let me = this,
            handler = 'onUpdateButtonTap';
        if(me[handler]) handler = me[handler].bind(me);
        return Ext.apply({
            xtype: 'button',
            langTooltip: 'Edit',
            iconCls: IconCls.update,
            handler: handler,
            ownerCmp: me
        }, config);
    },

    applyUpdateButton(config, old) {
        return Ext.updateWidget(old, config, this, 'createUpdateButton');
    },

    updateUpdateButton(config){
        config && this.add(config);
    },


    doDestroy(){
        this.destroyMembers( 'updateButton');
    }


})
