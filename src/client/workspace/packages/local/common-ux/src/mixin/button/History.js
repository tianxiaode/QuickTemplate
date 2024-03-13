Ext.define('Common.mixin.button.History', {
    extend: 'Common.mixin.Component',

    config: {
        historyButton: null
    },

    createHistoryButton(config) {
        return Ext.apply({
            xtype: 'button',
            ui: 'grey',
            langTooltip: 'History',
            iconCls: IconCls.history,
            handler: 'onHistoryButtonTap',
            arrow: false,
            disabled: true,
            ownerCmp: this
        }, config, this.getDefaults());        
    },        

    applyHistoryButton(config, old) {
        return Ext.updateWidget(old, config, this, 'createHistoryButton');
    },

    updateHistoryButton(config){
        config && this.add(config);
    },

    doDestroy(){
        this.destroyMembers('historyButton');
    }


})
