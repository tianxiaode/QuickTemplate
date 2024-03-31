Ext.define('Common.mixin.field.NewPassword', {
    extend: 'Common.mixin.Component',

    requires:[
        'Ext.field.Password',
        'Common.ux.data.validator.Password'
    ],

    config: {
        newPasswordField:{},
        confirmPasswordField:{}
    },

    createNewPasswordField(config){
        return Ext.apply({
            xtype: 'passwordfield',
            name: 'password',
            autoComplete: false,
            maxLength:128,
            ownerCmp: this
        }, config, this.getDefaults());        
    },

    applyNewPasswordField(config, old) {
        return Ext.updateWidget(old, config,this, 'createNewPasswordField');
    },

    updateNewPasswordField(config){
        config && this.add(config);
    },

    createConfirmPasswordField(config){
        return Ext.apply({
            xtype: 'passwordfield',
            name: 'confirmPassword',
            autoLabel: false,
            langLabel: 'NewPasswordConfirm',
            autoComplete: false,
            maxLength:128,
            validators(value){
                let me = this.up(),
                    p = me.getNewPasswordField(),
                    v = p.getValue();
                if( v !== value ) return I18N.get('PasswordNoEqual');
                return true;
            },
            ownerCmp: this
        }, config, this.getDefaults());                
    },

    applyConfirmPasswordField(config, old) {
        return Ext.updateWidget(old, config, this, 'createConfirmPasswordField');
    },

    updateConfirmPasswordField(config){
        config && this.add(config);
    },

    doDestroy() {
        this.destroyMembers('newPasswordField', 'confirmPasswordField');
    }



})
