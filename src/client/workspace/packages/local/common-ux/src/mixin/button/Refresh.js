Ext.define('Common.mixin.button.Refresh', {
    extend: 'Common.mixin.Component',

    config: {
        refreshButton: null,
        refreshButtonDefaults: {
            langTooltip: 'Refresh',
            iconCls: IconCls.refresh,
            handler: 'onRefreshButtonTap',
            mixinName: 'refreshButton'
        }
    },

    applyRefreshButton(config, old) {
        return Ext.updateWidget(old, config, this, 'getComponentConfig', 'refreshButtonDefaults');
    },

    updateRefreshButton(config){
        config && this.add(config);
    }


})
