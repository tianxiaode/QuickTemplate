
Ext.define('Common.shared.ux.data.validator.Password', {
    extend: 'Ext.data.validator.Validator',
    alias: 'data.validator.password',
 
    type: 'password',
    requireLength:6,
    requireDigit: true,
    requireLower: true,
    requireUpper: false,

    message: I18N.PasswordRegexText,
 
    validate: function(value){
        var me = this,
            setting = ConfigService.getSetting(),
            len = parseInt(setting['Abp.Identity.Password.RequiredLength']);
        if(value.length < len)  return me.message;
        if(setting['Abp.Identity.Password.RequireDigit'] === 'true' && !me.isDigit(value) ) return me.message;
        if(setting['Abp.Identity.Password.RequireLowercase'] === 'true' && !me.isLower(value) ) return me.message;
        if(setting['Abp.Identity.Password.RequireUppercase'] === 'true' && !me.isUpper(value) ) return me.message;
        if(setting['Abp.Identity.Password.RequireNonAlphanumeric'] === 'true' && !me.isNonAlphanumeric(value) ) return me.message;
        return true;
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

