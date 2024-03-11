Ext.define('Common.mixin.button.Refresh', {
    extend: 'Common.mixin.Component',

    config: {
        refreshButton: null
    },

    createRefreshButton(config) {
        let me = this,
            handler = 'onRefreshButtonTap';
        if(me[handler]) handler = me[handler].bind(me);
        return Ext.apply({
            xtype: 'button',
            langTooltip: 'Refresh',
            iconCls: IconCls.refresh,
            handler: handler,
            ownerCmp: me
        }, config);
    },

    applyRefreshButton(config, old) {
        return Ext.updateWidget(old, config, this, 'createRefreshButton');
    },

    updateRefreshButton(config){
        config && this.add(config);
    },


    doDestroy(){
        this.destroyMembers( 'refreshButton');
    }


})
