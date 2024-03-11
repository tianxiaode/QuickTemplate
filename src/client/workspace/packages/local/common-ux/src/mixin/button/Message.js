Ext.define('Common.mixin.button.Message', {
    extend: 'Common.mixin.Component',

    config: {
        messageButton: null
    },

    isErrorMessage: false,

    createMessageButton(config) {
        let me = this,
            handler = 'onMessageButtonTap';
        if(me[handler]) handler = me[handler].bind(me);
        return Ext.apply({
            xtype: 'button',
            iconCls: 'x-fa  fa-check-circle',
            handler: handler,
            tooltip: {
                align: 'b-t',
                zIndex: 1001,
                width: 200,
                autoCreate: true,
                anchor: true,
                hidden: true,
                autoHide: true,
                closable: false
            },
            ownerCmp: me
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

    /**
     * 显示信息按钮提示
     * @param {要显示的信息} message 
     * @param {是否错误信息} isError 
     */

    showMessageButtonTooltip(message, isError){
        let me = this,
            button = me.getMessageButton(),
            tooltip = button.getTooltip(),
            ui = isError ? 'danger' : 'success',
            iconCls = isError ? IconCls.error : IconCls.success;
        button.setMinWidth(32);
        button.setUi(ui);
        button.setIconCls(iconCls);
        tooltip.setHtml(`<p class="m-0 p-0 color-${ui}">${message}</p>`);
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
