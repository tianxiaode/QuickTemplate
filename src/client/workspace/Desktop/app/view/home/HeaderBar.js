Ext.define('Desktop.view.home.HeaderBar',{
    extend: 'Ext.Toolbar',
    xtype: 'desktop-headerbar',

    requires:[
        'Common.ux.Logo',
    ],

    mixins:[
        'Common.mixin.Spacer',
        'Common.mixin.button.Logout',
        'Common.mixin.button.Language',
        'Common.mixin.button.User'
    ],

    weighted: true,

    padding: '0 0 0 0',
    height: 64,

    spacer: { weight: 300 },
    languageButton: { weight: 400 },
    logoutButton: { weight: 500},
    userButton: { weight: 600},

    items:[
        {
            xtype: 'uxlogo',
            reference: 'logo',
            width: 250,
            weight: 100
        },
        {
            ui: 'grey',
            userCls: 'mx-2',
            iconCls: 'x-fa fa-bars',
            handler: 'onToggleNavigationSize',
            weight: 200
        },
        // {
        //     xtype: 'shared-notificationbutton',                      
        // },
        // {
        //     ui: 'header',
        //     iconCls: 'x-fa fa-cog',
        //     handler: 'onSetting',
        //     langTooltip: 'Setting',
        //     bind: { hidden: '{!isAuthenticated}'},
        // },
    ]
})