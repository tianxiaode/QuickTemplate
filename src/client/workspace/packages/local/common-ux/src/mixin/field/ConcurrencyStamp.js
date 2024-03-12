Ext.define('Common.mixin.field.ConcurrencyStamp', {
    extend: 'Common.mixin.Component',

    requires: [
        'Ext.field.Hidden'
    ],

    config: {
        concurrencyStampField: {},
        concurrencyStampFieldDefaults: {
            xtype: 'hiddenfield',
            name: 'concurrencyStamp',
            mixinName: 'concurrencyStampField',
        }
    },

    applyConcurrencyStampField(config, old) {
        return Ext.updateWidget(old, config, this, 'getComponentConfig', 'concurrencyStampFieldDefaults');
    },

    updateConcurrencyStampField(config) {
        config && this.add(config);
    }

})
