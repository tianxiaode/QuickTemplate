Ext.define('Common.view.settings.Emailing',{
    extend: 'Common.view.settings.BaseForm',
    xtype: 'emailingview',

    settingName: 'Emailing',
    resourceName: 'AbpSettingManagement',
    
    items:[
        { xtype: 'emailfield', name: 'defaultFromAddress', maxLength:128},
        { xtype: 'textfield', name: 'defaultFromDisplayName', maxLength:128},
        { xtype: 'textfield', name: 'smtpHost', maxLength:128},
        { 
            xtype: 'numberfield',
            minValue: 0,
            maxValue: 65525,
            name: 'smtpPort',
            value:587
        },
        { xtype: 'textfield', name: 'smtpUserName', maxLength:128},
        { xtype: 'passwordfield', name: 'smtpPassword', maxLength:128},
        {
            xtype: 'checkbox',
            name: 'smtpEnableSsl',                                            
            bodyAlign: 'start',
            inputValue:true,
            uncheckedValue: false,
        },
    ],

})