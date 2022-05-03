Ext.define('Common.view.settings.LookupPolicy',{
    extend: 'Common.view.settings.BaseForm',
    xtype: 'lookuppolicyview',

    settingName: 'LookupPolicy',
    resourceName: 'AbpIdentity',
    defaults:{
        labelWidth: 150,
        autoLabel: false,
    },
    items:[
        {
            xtype: 'checkboxfield',
            name: 'allowedForNewUsers', 
            inputValue:true,
            uncheckedValue: false,
            langBoxLabel: 'Abp.Identity.Lockout.AllowedForNewUsers',
        },
        { 
            xtype: 'numberfield',
            minValue: 3,
            maxValue: 10,
            name: 'maxFailedAccessAttempts',
            langLabel: 'Abp.Identity.Lockout.MaxFailedAccessAttempts',
        },
        { 
            xtype: 'numberfield',
            minValue: 1800,
            maxValue: 72000,
            name: 'lockoutDuration',
            langLabel: 'Abp.Identity.Lockout.LockoutDuration',
        },
    ],

})