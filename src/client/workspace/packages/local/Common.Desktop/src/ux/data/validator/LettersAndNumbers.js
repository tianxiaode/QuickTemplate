
/**
 * 验证输入是否包含字母和数字
 */
Ext.define('Common.Desktop.ux.data.validator.LettersAndNumbers', {
    extend: 'Ext.data.validator.Format',
    alias: 'data.validator.lettersAndNumbers',
 
    type: 'lettersAndNumbers',
    message: I18N.LettersAndNumbers,
 
    matcher: /^[a-zA-Z0-9]+$/
});

