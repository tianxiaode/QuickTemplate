Ext.define('Common.mixin.field.Id', {
    extend: 'Common.mixin.Component',

    requires: [
        'Ext.field.Hidden'
    ],

    config: {
        idField: {},
        idFieldDefaults: {
            xtype: 'hiddenfield',
            name: 'id',
            mixinName: 'idField'
        }
    },

    applyIdField(config, old) {
        return Ext.updateWidget(old, config, this, 'getComponentConfig', 'idFieldDefaults');
    },

    updateIdField(config) {
        config && this.add(config);
    }


})
