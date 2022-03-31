Ext.define('Common.mixin.component.Message', {
    extend: 'Common.mixin.component.Base',


    config: {
        messageButton: {
            xtype: 'uxmessagebutton',
            weight: 1
        },
    },

    createMessageButton(newCmp) {
        return Ext.apply({
            ownerCmp: this,
            listeners:{
                tap: this.onMessageButtonTap
            }
        }, newCmp);
    },

    applyMessageButton(newCmp, old) {
        return Ext.updateWidget(old, newCmp,
            this, 'createMessageButton');
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

    initMixinComponent(me, container){
        container.add(me.getMessageButton());
    },

})
