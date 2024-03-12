Ext.define('Common.mixin.field.Number', {
    extend: 'Common.mixin.Component',

    requires:[
        'Ext.field.Number'
    ],

    config: {
        numberField: {},
        numberFieldDefaults: {
            xtype: 'numberfield',
            fieldType: 'number',
            hidden: true,
            autoLabel: false,
            mixinName: 'numberField'
        }
    },

    applyNumberField(config, old) {
        return Ext.updateWidget(old, config,this, 'getComponentConfig', 'numberFieldDefaults');
    },

    updateNumberField(config){
        config && this.add(config);
    }

})
