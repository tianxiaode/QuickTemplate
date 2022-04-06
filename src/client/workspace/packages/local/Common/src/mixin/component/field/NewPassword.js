Ext.define('Common.mixin.component.field.NewPassword', {
    extend: 'Ext.Mixin',

    requires:[
        'Ext.field.Password',
        'Common.ux.data.validator.Password'
    ],

    mixinConfig: {
        configs: true,
    },

    config: {
        newPassword:{
            xtype: 'passwordfield',
            validators: 'password',
            autoComplete: false,
            maxLength:128
        },
        confirmPassword:{
            xtype: 'passwordfield',
            name: 'confirmPassword',
            autoLabel: false,
            langLabel: 'NewPasswordConfirm',
            autoComplete: false,
            maxLength:128,
            validators(value){
                var me = this.up(),
                    p = me.getNewPassword(),
                    v = p.getValue();
                if( v !== value ) return I18N.get('PasswordNoEqual');
                return true;
            },

        }
    },

    hasNewPasswordField: true,
    newPasswordFieldName: 'password',
    newPasswordFieldIndex: 3,

    createNewPassword(newCmp) {
        return Ext.apply({
            ownerCmp: this,
            name: this.newPasswordFieldName
        }, newCmp);
    },

    applyNewPassword(newCmp, old) {
        return Ext.updateWidget(old, newCmp,
            this, 'createNewPassword');
    },

    updateNewPassword(config){
        let me = this;
        me.hasNewPasswordField && config && me.insert(me.newPasswordFieldIndex,config);
    },

    createConfirmPassword(newCmp) {
        return Ext.apply({
            ownerCmp: this,
        }, newCmp);
    },

    applyConfirmPassword(newCmp, old) {
        return Ext.updateWidget(old, newCmp,
            this, 'createConfirmPassword');
    },

    updateConfirmPassword(config){
        let me = this;
        me.hasNewPasswordField && config && me.insert(me.newPasswordFieldIndex+1,config);
    },


})
