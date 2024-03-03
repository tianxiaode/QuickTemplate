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
        let form = me.getForm() || me;
        form.onReset();
    },

    doDestroy(){
        this.destroyMembers( 'resetButton');
    }


})
