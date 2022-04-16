Ext.define('Phone.view.dashboard.Dashboard', {
    extend: 'Ext.Container',
    xtype : 'phonedashboard', 
    
    requires:[
        'Ext.Toolbar',
        'Common.ux.dataview.List',
        'Common.ux.Logo', 
        'Common.ux.button.Language',
        'Common.ux.button.Logout',
        'Phone.view.dashboard.DashboardController',
        'Phone.view.dashboard.MenuItem',
    ],

    controller: 'phone-dashboardcontroller',
    layout: 'vbox',

    ui: 'dark',

    header:{
        items:[
            // {
            //     xtype: 'shared-notificationbutton',
            //     margin: '0 16 0 0',
            // },
        ],
        tools:[
        ]

    },
    
    items: [
        {
            xtype: 'toolbar',
            ui: 'dark',
            items:[
                {
                    xtype: 'uxlogo',
                    reference: 'logo',
                    flex: 1
                },
                {
                    xtype: 'uxlanguagebutton',
                },        
                {
                    xtype: 'uxlogoutbutton',                
                }        
            ]
        },
        {
            xtype: 'uxlist',
            hasPaging: false,
            inline: true,
            flex: 1,
            bind: { store: '{menus}'},
            itemConfig:{
                xtype: 'dashboardmenuitem'
            },
            listeners:{
                childtap: 'onMenuItemTap'
            }
        },
    ]
});