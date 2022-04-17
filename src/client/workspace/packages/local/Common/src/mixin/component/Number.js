Ext.define('Common.mixin.component.Number', {
    extend: 'Ext.Mixin',

    requires:[
        'Ext.field.Number'
    ],

    mixinConfig: {
        configs: true,
    },

    config: {
        uxNumber: {
            xtype: 'numberfield',
            fieldType: 'number',
            hidden: true,
            autoLabel: false,
        },
    },

    hasNumber: false,

    createNumber(newCmp) {
        return Ext.apply({
            ownerCmp: this,
        }, newCmp);
    },

    applyNumber(newCmp, old) {
        return Ext.updateWidget(old, newCmp,
            this, 'hasNumber');
    },

    updateNumber(config){
        this.hasNumber && config && this.add(config);
    },


})
