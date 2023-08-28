Ext.define('Common.mixin.component.field.ConcurrencyStamp', {
    extend: 'Common.mixin.component.Base',

    requires: [
        'Ext.field.Hidden'
    ],

    config: {
        concurrencyStamp: {},
    },

    createConcurrencyStamp(config) {
        return Ext.apply({
            xtype: 'hiddenfield',
            name: 'concurrencyStamp',
            ownerCmp: this,
        }, config);
    },

    applyConcurrencyStamp(config, old) {
        return Ext.updateWidget(old, config, this, 'createConcurrencyStamp');
    },

    updateConcurrencyStamp(config) {
        config && this.add(config);
    },

    destroy() {
        this.setConcurrencyStamp(null);
    }



})
