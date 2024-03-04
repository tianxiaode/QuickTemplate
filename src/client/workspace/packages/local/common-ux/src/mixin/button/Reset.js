Ext.define('Common.mixin.button.Reset', {
    extend: 'Common.mixin.Component',

    config: {
        resetButton: null
    },

    createResetButton(config) {
        let me = this,
            handler = 'onResetButtonTap';
        if(me[handler]) handler = me[handler].bind(me);
        return Ext.apply({
            xtype: 'button',
            ui: 'grey',
            langTooltip: 'Reset',
            iconCls: 'x-fa fa-undo',
            handler: handler,
            ownerCmp: me
        }, config);
    },

    applyResetButton(config, old) {
        return Ext.updateWidget(old, config, this, 'createResetButton');
    },

    updateResetButton(config){
        config && this.add(config);
    },

    onResetButtonTap(){
        let formContainer = this.up(`{getForm}`),
            form = formContainer.getForm();
        Logger.debug(this.onResetButtonTap, formContainer);
        form.reset();
        form.clearErrors();
    },

    doDestroy(){
        this.destroyMembers( 'resetButton');
    }


})
