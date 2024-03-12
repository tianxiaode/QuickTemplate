Ext.define('Common.mixin.button.History', {
    extend: 'Common.mixin.Component',

    config: {
        historyButton: null,
        historyButtonDefaults: {
            ui: 'grey',
            langTooltip: 'History',
            iconCls: IconCls.history,
            handler: 'onHistoryButtonTap',            
            arrow: false,
            disabled: true,
            mixinName: 'historyButton'

        }
    },

    applyHistoryButton(config, old) {
        return Ext.updateWidget(old, config, this, 'getComponentConfig', 'historyButtonDefaults');
    },

    updateHistoryButton(config){
        config && this.add(config);
    }

})
