Ext.define('Desktop.view.home.HeaderBar',{
    extend: 'Ext.Toolbar',
    xtype: 'desktop-headerbar',

    requires:[
        'Common.ux.Logo',
        'Common.ux.button.user.Button',
        'Common.ux.button.Logout',
        'Common.ux.button.Language'
    ],

    padding: '0 0 0 0',
    height: 64,
    items:[
        {
            xtype: 'uxlogo',
            reference: 'logo',
            width: 250,
        },
        {
            xtype: 'spacer',width: 5
        },
        {
            ui: 'header',
            iconCls: 'x-fa fa-bars',
            handler: 'onToggleNavigationSize'
        },
        {
            xtype: 'spacer',width: 5
        },
        '->',
        {
            xtype: 'uxlanguagebutton',
            ui: 'header',
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
        {
            xtype: 'uxlogoutbutton',
        },
        {
            xtype: 'spacer',width: 5
        },
        {
            xtype: 'uxuserbutton',                    
        }

    ]
})