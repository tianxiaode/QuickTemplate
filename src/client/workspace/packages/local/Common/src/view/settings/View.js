Ext.define('Common.view.settings.View',{
    extend: 'Ext.Container',
    xtype: 'systemsettingview',    

    mixins:[
        'Common.mixin.component.TabBar'
    ],

    requires:[
        'Common.view.settings.Emailing',
        'Common.view.settings.PasswordPolicy',
        'Common.view.settings.LookupPolicy',
    ],

    layout: 'vbox',
    isPassingResource: false,

    tabs:[
        {
            langText: 'SettingManagement.Emailing', pageType: 'emailingview', resourceName: 'Permissions',
            pageItemId: 'emailing', permission: 'SettingManagement.Emailing'
        },
        {
            langText: 'SettingManagement.PasswordPolicy', pageType: 'passwordpolicyview', resourceName: 'Permissions',
            pageItemId: 'passwordPolicy', permission: 'SettingManagement.PasswordPolicy'
        },
        {
            langText: 'SettingManagement.LookupPolicy', pageType: 'lookuppolicyview', resourceName: 'Permissions',
            pageItemId: 'lookupPolicy', permission: 'SettingManagement.LookupPolicy'
        }
    ]
})