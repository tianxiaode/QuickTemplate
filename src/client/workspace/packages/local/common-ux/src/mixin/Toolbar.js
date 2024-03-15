Ext.define('Common.mixin.Toolbar', {
    extend: 'Common.mixin.Component',

    config: {
        toolbar: null,
    },

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

    doDestroy() {
        this.destroyMembers('toolbar');
    }

});
