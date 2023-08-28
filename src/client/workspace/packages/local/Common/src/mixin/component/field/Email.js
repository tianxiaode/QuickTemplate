Ext.define('Common.mixin.component.field.Email', {
    extend: 'Common.mixin.component.Base',

    requires: [
        'Ext.data.validator.Email'
    ],

    config: {
        emailField: {}
    },

    createEmailField(config) {
        return Ext.apply({
            xtype: 'textfield',
            name: 'email',
            validators: 'email',
            maxLength: 256,
            ownerCmp: this
        }, config);
    },

    applyEmailField(config, old) {
        return Ext.updateWidget(old, config, this, 'createEmailField');
    },

    updateEmailField(config) {
        config && this.add(config);
    },

    doDestroy() {
        this.setEmailField(null);
    }


})
