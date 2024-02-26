Ext.define('Common.mixin.component.Message', {
    extend: 'Common.mixin.Component',

    requires:[
        'Common.ux.button.Message'
    ],

    config: {
        messageButton: {},
    },

    createMessageButton(config) {
        return Ext.apply({
            xtype: 'uxmessagebutton',
            weight: 1,
            ownerCmp: this,
            listeners:{
                tap: this.onMessageButtonTap
            }
        }, config);
    },

    applyMessageButton(config, old) {
        return Ext.updateWidget(old, config, this, 'createMessageButton');
    },

    updateMessageButton(config){
        config && this.add(config);
    },

    onMessageButtonTap(sender){
        sender.getTooltip().show();
    },

    showMessage(msg, isError){
        let me = this,
            button = me.getMessageButton(),
            tooltip = button.getTooltip();
        button.setError(isError);
        button.setMessage(msg);
        button.setHidden(false);
        tooltip.show();
        Ext.defer(tooltip.hide, 2000, tooltip);
    },

    hideMessageButton(){
        this.getMessageButton().setHidden(true);
    },

    doDestroy() {
        this.destroyMembers('messageButton');
    }
    

})
