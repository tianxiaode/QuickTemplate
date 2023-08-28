Ext.define('Common.mixin.component.field.UxNumber', {
    extend: 'Common.mixin.component.Base',

    requires:[
        'Common.ux.field.Number'
    ],

    config: {
        uxNumber: {},
    },

    createUxNumber(config) {
        return Ext.apply({
            xtype: 'uxnumberfield',
            fieldType: 'uxnumber',
            hidden: true,
            autoLabel: false,
            ownerCmp: this,
        }, config);
    },

    applyUxNumber(config, old) {
        return Ext.updateWidget(old, config, this, 'createUxNumber');
    },

    updateUxNumber(config){
        config && this.add(config);
    },

    destroy() {
        this.setUxNumber(null);
    }

})
