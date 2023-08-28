Ext.define('Common.mixin.component.field.Id', {
    extend: 'Common.mixin.component.Base',

    requires: [
        'Ext.field.Hidden'
    ],

    config: {
        idField: {},
    },


    createIdField(config) {
        return Ext.apply({
            xtype: 'hiddenfield',
            name: 'id',
            ownerCmp: this,
        }, config);
    },

    applyIdField(config, old) {
        return Ext.updateWidget(old, config, this, 'createIdField');
    },

    updateIdField(config) {
        config && this.add(config);
    },

    destroy() {
        this.setIdField(null);
    }



})
