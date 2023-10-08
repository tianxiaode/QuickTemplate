
Ext.define('Common.core.data.validator.Mobile', {
    extend: 'Ext.data.validator.Format',
    alias: 'data.validator.mobile',
 
    type: 'mobile',
    langMessage: 'NotValidMobile',
 
    matcher: /^1[3-9]\d{9}$/
});

