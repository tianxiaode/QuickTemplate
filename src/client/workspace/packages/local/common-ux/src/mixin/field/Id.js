Ext.define('Common.mixin.field.Id', {
    extend: 'Common.mixin.Component',

    requires: [
        'Ext.field.Hidden'
    ],

    config: {
        idField: {}
    },

    createIdField(config){
        return Ext.apply({
            xtype: 'hiddenfield',
            name: 'id',
            ownerCmp: this
        }, config, this.getDefaults())
    },

    applyIdField(config, old) {
        return Ext.updateWidget(old, config, this, 'createIdField');
    },

    updateIdField(config) {
        config && this.add(config);
    },

    doDestroy() {
        this.destroyMembers('idField');
    }
})
