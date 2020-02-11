
/**
 * 验证输入是否11位手机号码
 */
Ext.define('Common.Desktop.ux.data.validator.Mobile', {
    extend: 'Ext.data.validator.Format',
    alias: 'data.validator.mobile',
 
    type: 'mobile',
    message: I18N.NotValidMobile,
 
    matcher: /^1[3-9]\d{9}$/
});

