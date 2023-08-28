Ext.define('Common.mixin.component.field.NewPassword', {
    extend: 'Common.mixin.component.Base',

    requires:[
        'Ext.field.Password',
        'Common.ux.data.validator.Password'
    ],

    config: {
        newPassword:{},
        confirmPassword:{}
    },

    createNewPassword(config) {
        return Ext.apply({
            xtype: 'passwordfield',
            validators: 'password',
            autoComplete: false,
            maxLength:128,
            ownerCmp: this
        }, config);
    },

    applyNewPassword(config, old) {
        return Ext.updateWidget(old, config,this, 'createNewPassword');
    },

    updateNewPassword(config){
        config && this.add(config);
    },

    createConfirmPassword(config) {
        return Ext.apply({
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
            ownerCmp: this
        }, config);
    },

    applyConfirmPassword(config, old) {
        return Ext.updateWidget(old, config, this, 'createConfirmPassword');
    },

    updateConfirmPassword(config){
        config && this.add(config);
    },

    destroy() {
        this.setNewPassword(null);
        this.setConfirmPassword(null);
    }



})
