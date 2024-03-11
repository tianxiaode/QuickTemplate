Ext.define('Common.mixin.field.Id', {
    extend: 'Common.mixin.Component',

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
        let me = this;
        if(!config) return;

        me.add(config);
        let record = me.getRecord();
        record && config.setValue(record.get(config.getName()));
    },

    doDestroy() {
        this.destroyMembers('idField');
    }



})
