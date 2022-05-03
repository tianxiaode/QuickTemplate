Ext.define('Common.view.settings.PasswordPolicy',{
    extend: 'Common.view.settings.BaseForm',
    xtype: 'passwordpolicyview',

    settingName: 'PasswordPolicy',
    resourceName: 'AbpIdentity',
    defaults:{
        labelWidth: 150,
        autoLabel: false,
    },
    items:[
        {
            xtype: 'checkboxfield',
            name: 'requireDigit', 
            inputValue:true,
            uncheckedValue: false,
            langBoxLabel: 'Abp.Identity.Password.RequireDigit',
        },
        {
            xtype: 'checkboxfield',
            name: 'requireLowercase',                                            
            inputValue:true,
            uncheckedValue: false,
            langBoxLabel: 'Abp.Identity.Password.RequireLowercase',
        },
        {
            xtype: 'checkboxfield',
            inputValue:true,
            name: 'requireNonAlphanumeric',                                            
            uncheckedValue: false,
            langBoxLabel: 'Abp.Identity.Password.RequireNonAlphanumeric',
        },
        {
            xtype: 'checkboxfield',
            name: 'requireUppercase',                                            
            inputValue:true,
            uncheckedValue: false,
            langBoxLabel: 'Abp.Identity.Password.RequireUppercase',
        },        
        { 
            xtype: 'numberfield',
            minValue: 6,
            maxValue: 128,
            name: 'requiredLength',
            langLabel: 'Abp.Identity.Password.RequiredLength',
        },
        // { 
        //     xtype: 'numberfield',
        //     minValue: 0,
        //     maxValue: 50,
        //     name: 'requiredUniqueChars',
        //     value:6,
        //     langLabel: 'Abp.Identity.Password.RequiredUniqueChars',
        // },
    ],

})