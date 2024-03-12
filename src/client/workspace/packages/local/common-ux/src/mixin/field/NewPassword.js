Ext.define('Common.mixin.field.NewPassword', {
    extend: 'Common.mixin.Component',

    requires:[
        'Ext.field.Password',
        'Common.ux.data.validator.Password'
    ],

    config: {
        newPasswordField:{},
        newPasswordFieldDefaults:{
            xtype: 'passwordfield',
            name: 'password',
            autoComplete: false,
            maxLength:128,
            mixinName: 'newPasswordField'
        },
        confirmPasswordField:{},
        confirmPasswordFieldDefaults:{
            xtype: 'passwordfield',
            name: 'confirmPassword',
            autoLabel: false,
            langLabel: 'NewPasswordConfirm',
            autoComplete: false,
            maxLength:128,
            validators(value){
                let me = this.up(),
                    p = me.getNewPassword(),
                    v = p.getValue();
                if( v !== value ) return I18N.get('PasswordNoEqual');
                return true;
            },
            mixinName: 'confirmPasswordField'
        }
    },

    applyNewPasswordField(config, old) {
        return Ext.updateWidget(old, config,this, 'getComponentConfig', 'newPasswordFieldDefaults');
    },

    updateNewPasswordField(config){
        config && this.add(config);
    },

    applyConfirmPasswordField(config, old) {
        return Ext.updateWidget(old, config, this, 'getComponentConfig', 'confirmPasswordFieldDefaults');
    },

    updateConfirmPasswordField(config){
        config && this.add(config);
    }


})
