Ext.define('Common.mixin.component.field.Id', {
    extend: 'Ext.Mixin',

    requires:[
        'Ext.field.Hidden'
    ],

    mixinConfig: {
        configs: true,
    },

    config: {
        idField: {
            xtype: 'hiddenfield',
            name: 'id'
        },
    },

    hasIdField: true,

    createIdField(newCmp) {
        return Ext.apply({
            ownerCmp: this,
        }, newCmp);
    },

    applyIdField(newCmp, old) {
        return Ext.updateWidget(old, newCmp,
            this, 'createIdField');
    },

    updateIdField(config){
        this.hasIdField && config && this.insert(0,config);
    },


})
