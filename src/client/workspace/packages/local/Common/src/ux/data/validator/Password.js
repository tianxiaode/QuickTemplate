
Ext.define('Common.ux.data.validator.Password', {
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
            resourceName = 'AbpIdentity',
            len = parseInt(setting.requiredLength)
            msg = [];
        (value.length < len) && msg.push(Format.format(I18N.get('Volo.Abp.Identity:PasswordTooShort',resourceName), setting.requiredLength));
        (setting.requireDigit === 'True' && !me.isDigit(value) ) && msg.push(I18N.get('Volo.Abp.Identity:PasswordRequiresDigit',resourceName));
        (setting.requireLowercase === 'True' && !me.isLower(value)) &&  msg.push(I18N.get('Volo.Abp.Identity:PasswordRequiresLower',resourceName));
        (setting.requireUppercase === 'True' && !me.isUpper(value)) &&  msg.push(I18N.get('Volo.Abp.Identity:PasswordRequiresUpper',resourceName));
        (setting.requireNonAlphanumeric === 'True' && !me.isNonAlphanumeric(value)) && msg.push(I18N.get('Volo.Abp.Identity:PasswordRequiresNonAlphanumeric', resourceName));
        return msg.length>0 ? msg.join(',') : true;
    },

    isDigit: function(value){
        return (/[0-9]/gi).test(value);
    },

    isLower: function(value){
        return (/[a-z]/g).test(value);
    },

    isUpper: function(value){
        return (/[A-Z]/g).test(value);
    },

    isNonAlphanumeric(value){
        return (/[\W_]/gi).test(value);
    },

    uniqueChars(len, value){
        let unique = new Set(Array.from(value));
        return unique.size >= len;
    }
});

