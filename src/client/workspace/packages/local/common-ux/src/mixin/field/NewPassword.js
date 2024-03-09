Ext.define('Common.mixin.field.NewPassword', {
    extend: 'Common.mixin.Component',

    requires:[
        'Ext.field.Password',
        'Common.ux.data.validator.Password'
    ],

    config: {
        newPassword:{},
        confirmPassword:{}
    },

    createNewPassword(config) {
        let me =this;
        return Ext.apply({
            xtype: 'passwordfield',
            validators: 'password',
            name: 'password',
            autoComplete: false,
            required: me.isEdit ? false : true,
            maxLength:128,
            ownerCmp: me
        }, config, me.getDefaults());
    },

    applyNewPassword(config, old) {
        return Ext.updateWidget(old, config,this, 'createNewPassword');
    },

    updateNewPassword(config){
        config && this.add(config);
    },

    createConfirmPassword(config) {
        let me =this;
        return Ext.apply({
            xtype: 'passwordfield',
            name: 'confirmPassword',
            autoLabel: false,
            langLabel: 'NewPasswordConfirm',
            required: me.isEdit ? false : true,
            autoComplete: false,
            maxLength:128,
            validators(value){
                let me = this.up(),
                    p = me.getNewPassword(),
                    v = p.getValue();
                if( v !== value ) return I18N.get('PasswordNoEqual');
                return true;
            },
            ownerCmp: me
        }, config, me.getDefaults());
    },

    applyConfirmPassword(config, old) {
        return Ext.updateWidget(old, config, this, 'createConfirmPassword');
    },

    updateConfirmPassword(config){
        config && this.add(config);
    },

    doDestroy() {
        this.destroyMembers('newPassword', 'confirmPassword');
    }



})
