Ext.define('Common.mixin.component.field.Email', {
    extend: 'Ext.Mixin',

    mixinConfig: {
        configs: true,
    },

    config: {
        emailField: {
            xtype: 'textfield',
            name: 'email',
            validators: 'email',
            maxLength: 256
        },
    },

    hasEmailField: true,
    emailRequired: true,
    emailFieldIndex: 3,

    createEmailField(newCmp) {
        return Ext.apply({
            ownerCmp: this,
            required: this.emailRequired
        }, newCmp);
    },

    applyEmailField(newCmp, old) {
        return Ext.updateWidget(old, newCmp,
            this, 'createEmailField');
    },

    updateEmailField(config){
        let me = this;
        me.hasEmailField && config && me.insert(me.emailFieldIndex,config);
    },


})
