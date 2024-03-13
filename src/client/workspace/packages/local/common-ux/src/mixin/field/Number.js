Ext.define('Common.mixin.field.Number', {
    extend: 'Common.mixin.Component',

    requires:[
        'Ext.field.Number'
    ],

    config: {
        numberField: {}
    },

    createNumberField(config){
        return Ext.apply({
            xtype: 'numberfield',
            fieldType: 'number',
            hidden: true,
            autoLabel: false,
            ownerCt: this
        }, config, this.getDefaults())
    },

    applyNumberField(config, old) {
        return Ext.updateWidget(old, config,this, 'createNumberField');
    },

    updateNumberField(config){
        config && this.add(config);
    },

    doDestroy() {
        this.destroyMembers('numberField');
    }

})
