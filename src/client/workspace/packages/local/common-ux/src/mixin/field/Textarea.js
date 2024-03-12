Ext.define('Common.mixin.field.Textarea', {
    extend: 'Common.mixin.Component',

    requires: [
        'Ext.field.TextArea'
    ],

    config: {
        textareaField: {},
        textareaFieldDefaults: {
            xtype: 'textareafield',
            fieldType: 'textarea',
            minHeight: 300,
            hidden: true,
            autoLabel: false,
            mixinName: 'textareaField',
        }
    },


    applyTextareaField(config, old) {
        return Ext.updateWidget(old, config, this, 'getComponentConfig', 'textareaFieldDefaults');
    },

    updateTextareaField(config) {
        config && this.add(config);
    }

})
