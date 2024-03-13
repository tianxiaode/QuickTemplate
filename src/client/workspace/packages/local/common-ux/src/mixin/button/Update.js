Ext.define('Common.mixin.button.Update', {
    extend: 'Common.mixin.Component',

    config: {
        updateButton: null
    },

    createUpdateButton(config) {
        return Ext.apply({
            xtype: 'button',
            langTooltip: 'Edit',
            iconCls: IconCls.update,
            handler: 'onUpdateButtonTap',
            isCrud: true,
            crudName: 'update',
            weight: 200,
            ownerCmp: this
        }, config, this.getDefaults());
        
    },

    applyUpdateButton(config, old) {
        return Ext.updateWidget(old, config, this, 'createUpdateButton');
    },

    updateUpdateButton(config){
        config && this.add(config);
    },

    doDestroy(){
        this.destroyMembers('updateButton');
    }


})
