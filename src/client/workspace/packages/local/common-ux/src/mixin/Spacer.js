Ext.define('Common.mixin.Spacer', {
    extend: 'Common.mixin.Component',

    requires: [
        'Ext.Spacer'
    ],

    config: {
        spacer: null
    },

    createSpacer(config) {
        return Ext.apply({
            xtype: 'spacer',
            ownerCt: this
        }, config);
    },

    applySpacer(config, old) {
        return Ext.updateWidget(old, config, this, 'createSpacer');
    },

    updateSpacer(config) {
        config && this.add(config);
    },

    doDestroy() {
        this.destroyMembers('spacer');
    }

});
