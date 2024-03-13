Ext.define('Common.mixin.Toolbar', {
    extend: 'Common.mixin.Component',

    config: {
        toolbar: null,
    },

    isInitButtonScope: false,

    createToolbar(config) {
        return Ext.apply({
            xtype: 'toolbar',
            userCls: 'bg-content',
            shadow: false,
            weighted: true,
            ownerCt: this
        }, config);
    },

    applyToolbar(config, old) {
        return Ext.updateWidget(old, config, this, 'createToolbar');
    },

    updateToolbar(config) {
        config && this.add(config);
    },

    afterInitialize() {
        let me = this;
        if(!me.isInitButtonScope) return;
        let buttons = me.getToolbar().query('[isButton]');
        Logger.debug(this.afterInitialize, buttons);
        Ext.each(buttons, btn=> {            
            btn.setScope(me);
        });
    },


    doDestroy() {
        this.destroyMembers('toolbar');
    }

});
