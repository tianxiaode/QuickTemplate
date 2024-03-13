Ext.define('Common.mixin.button.Refresh', {
    extend: 'Common.mixin.Component',

    config: {
        refreshButton: null
    },

    createRefreshButton(config) {
        return Ext.apply({
            xtype: 'button',
            langTooltip: 'Refresh',
            iconCls: IconCls.refresh,
            handler: 'onRefreshButtonTap',
            isCrud: true,
            crudName: 'refresh',
            weight: 400,
            ownerCmp: this
        }, config, this.getDefaults());
    },

    applyRefreshButton(config, old) {
        return Ext.updateWidget(old, config, this, 'createRefreshButton');
    },

    updateRefreshButton(config){
        config && this.add(config);
    },

    doDestroy(){
        this.destroyMembers('refreshButton');
    }

})
