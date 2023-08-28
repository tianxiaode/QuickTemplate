Ext.define('Common.mixin.component.field.Number', {
    extend: 'Common.mixin.component.Base',

    requires:[
        'Ext.field.Number'
    ],

    config: {
        numberField: {},
    },

    hasNumber: false,

    createNumberFeild(config) {
        return Ext.apply({
            xtype: 'numberfield',
            fieldType: 'number',
            hidden: true,
            autoLabel: false,
            ownerCmp: this
        }, config);
    },

    applyNumberField(config, old) {
        return Ext.updateWidget(old, config,this, 'createNumberFeild');
    },

    updateNumberField(config){
        config && this.add(config);
    },

    destroy(){
        this.setNumberField(null);
    }

})
