Ext.define('Common.mixin.field.TextField', {
    extend: 'Common.mixin.Component',

    config: {
        textField: {},
        textFieldDefaults: {
            xtype: 'textfield',
            fieldType: 'text',
            hidden: true,
            autoLabel: false,
            mixinName: 'textField'
        }
    },

    applyTextField(config, old) {
        return Ext.updateWidget(old, config, this, 'getComponentConfig', 'textFieldDefaults');
    },

    updateTextField(config){
        config && this.add(config);
    }

})
