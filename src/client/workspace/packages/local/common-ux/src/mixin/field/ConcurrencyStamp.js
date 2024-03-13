Ext.define('Common.mixin.field.ConcurrencyStamp', {
    extend: 'Common.mixin.Component',

    requires: [
        'Ext.field.Hidden'
    ],

    config: {
        concurrencyStampField: {}
    },

    createConcurrencyStampField(config){
        return Ext.apply({
            xtype: 'hiddenfield',
            name: 'concurrencyStamp',
            ownerCmp: this,
        }, config, this.getDefaults());
    },

    applyConcurrencyStampField(config, old) {
        return Ext.updateWidget(old, config, this, 'createConcurrencyStampField');
    },

    updateConcurrencyStampField(config) {
        config && this.add(config);
    },

    doDestroy() {
        this.destroyMembers('concurrencyStampField');
    }

})
