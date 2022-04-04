Ext.define('Common.mixin.component.UxNumber', {
    extend: 'Ext.Mixin',

    requires:[
        'Common.ux.field.Number'
    ],

    mixinConfig: {
        configs: true,
    },

    config: {
        uxNumber: {
            xtype: 'uxnumberfield',
            inputType: 'uxnumber',
            hidden: true,
            autoLabel: false,
        },
    },

    hasUxNumber: false,

    createUxNumber(newCmp) {
        return Ext.apply({
            ownerCmp: this,
        }, newCmp);
    },

    applyUxNumber(newCmp, old) {
        return Ext.updateWidget(old, newCmp,
            this, 'createUxNumber');
    },

    updateUxNumber(config){
        this.hasUxNumber && config && this.add(config);
    },


})
