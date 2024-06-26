Ext.define('Common.mixin.Form', {
    extend: 'Common.mixin.Component',

    config: {
        form: null
    },

    createForm(config) {
        return Ext.apply({
            xtype: 'form',
            flex: 1
        }, config);
    },

    applyForm(config, old) {
        return Ext.updateWidget(old, config, this, 'createForm');
    },

    updateForm(config) {
        config && this.add(config);
    },

    doDestroy() {
        this.destroyMembers('form');
    }


})
