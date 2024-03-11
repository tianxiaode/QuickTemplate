Ext.define('Common.mixin.button.History', {
    extend: 'Common.mixin.Component',

    config: {
        historyButton: null
    },

    createHistoryButton(config) {
        let me = this,
            handler = 'onHistoryButtonTap';
        if(me[handler]) handler = me[handler].bind(me);
        return Ext.apply({
            xtype: 'button',
            ui: 'grey',
            langTooltip: 'History',
            iconCls: IconCls.history,
            handler: handler,
            arrow: false,
            disabled: true,
            ownerCmp: me
        }, config);
    },

    applyHistoryButton(config, old) {
        return Ext.updateWidget(old, config, this, 'createHistoryButton');
    },

    updateHistoryButton(config){
        config && this.add(config);
    },


    doDestroy(){
        this.destroyMembers( 'historyButton');
    }


})
