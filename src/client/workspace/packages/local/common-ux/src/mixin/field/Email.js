Ext.define('Common.mixin.field.Email', {
    extend: 'Common.mixin.Component',

    requires: [
        'Ext.data.validator.Email'
    ],

    config: {
        emailField: {},
        emailFieldDefaults: {
            xtype: 'textfield',
            name: 'email',
            validators: 'email',
            maxLength: 256,
            mixinName: 'emailField'
        }
    },

    applyEmailField(config, old) {
        return Ext.updateWidget(old, config, this, 'getComponentConfig', 'emailFieldDefaults');
    },

    updateEmailField(config) {
        config && this.add(config);
    }

})
