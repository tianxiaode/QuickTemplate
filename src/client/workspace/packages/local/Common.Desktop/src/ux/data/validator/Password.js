
/**
 * 验证密码是否符合要求
 */
Ext.define('Common.Desktop.ux.data.validator.Password', {
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
            len = me.requireLength;
        if(value.length < len)  return me.message;
        if(me.requireDigit && !me.isDigit(value) ) return me.message;
        if(me.requireLower && !me.isLower(value) ) return me.message;
        if(me.requireUpper && !me.isUpper(value) ) return me.message;
        return true;
    },

    isDigit: function(value){
        return (/[0-9]/gi).test(value);
    },

    isLower: function(value){
        return(/[a-z]/gi).test(value);
    },

    isUpper: function(value){
        return(/[A-Z]/gi).test(value);
    },
});

