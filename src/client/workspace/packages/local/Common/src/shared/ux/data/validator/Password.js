
Ext.define('Common.shared.ux.data.validator.Password', {
    extend: 'Ext.data.validator.Validator',
    alias: 'data.validator.password',
 
    type: 'password',
    requireLength:6,
    requireDigit: true,
    requireLower: true,
    requireUpper: false,

    validate(value){
        let me = this,
            setting = Config.getPasswordSetting(),
            len = parseInt(setting.requiredLength),
            message = me.getErrorMessage(setting);
        if(value.length < len)  return message;
        if(setting.requireDigit === 'true' && !me.isDigit(value) ) return message;
        if(setting.requireLowercase === 'true' && !me.isLower(value) ) return message;
        if(setting.requireUppercase === 'true' && !me.isUpper(value) ) return message;
        if(setting.requireNonAlphanumeric === 'true' && !me.isNonAlphanumeric(value) ) return message;
        return true;
    },

    getErrorMessage(setting){
        let msg = []
        if(setting.requireDigit) msg.push(I18N.get('PasswordRequireDigit'));
        if(setting.requireLowercase) msg.push(I18N.get('PasswordRequireLowercase'));
        if(setting.requireUppercase) msg.push(I18N.get('PasswordRequireUppercase'));
        if(setting.requireNonAlphanumeric) msg.push(I18N.get('PasswordRequireNonAlphanumeric'));
        msg.push(Format.format(I18N.get('PasswordRequireLength'), setting.requiredLength));
        return msg.join(',') ;
    },

    isDigit: function(value){
        return (/[0-9]/gi).test(value);
    },

    isLower: function(value){
        return (/[a-z]/gi).test(value);
    },

    isUpper: function(value){
        return (/[A-Z]/gi).test(value);
    },

    isNonAlphanumeric(value){
        return (/[\W_]/gi).test(value);
    }
});

