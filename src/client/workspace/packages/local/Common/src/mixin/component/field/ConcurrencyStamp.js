Ext.define('Common.mixin.component.field.ConcurrencyStamp', {
    extend: 'Ext.Mixin',

    requires:[
        'Ext.field.Hidden'
    ],

    mixinConfig: {
        configs: true,
    },

    config: {
        concurrencyStamp: {
            xtype: 'hiddenfield',
            name: 'concurrencyStamp'
        },
    },

    hasConcurrencyStamp: true,

    createConcurrencyStamp(newCmp) {
        return Ext.apply({
            ownerCmp: this,
        }, newCmp);
    },

    applyConcurrencyStamp(newCmp, old) {
        return Ext.updateWidget(old, newCmp,
            this, 'createConcurrencyStamp');
    },

    updateConcurrencyStamp(config){
        this.hasConcurrencyStamp && config && this.insert(1,config);
    },


})
