Ext.define('Phone.view.dashboard.Dashboard', {
    extend: 'Ext.Container',
    xtype : 'phonedashboard', 
    
    requires:[
        'Ext.Toolbar',
        'Common.ux.dataview.List',
        'Common.ux.Logo', 
        'Common.ux.button.Logout',
        'Phone.view.dashboard.DashboardController',
        'Phone.view.dashboard.MenuItem',
    ],

    controller: 'phone-dashboardcontroller',
    layout: 'vbox',
    
    items: [
        {
            xtype: 'toolbar',
            ui: 'dark',
            padding: '0 0 0 5',
            items:[
                {
                    xtype: 'uxlogo',
                    reference: 'logo',
                    flex: 1
                },
                // {
                //     xtype: 'shared-notificationbutton',
                //     margin: '0 16 0 0',
                // },
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
            itemTpl: `
                <p><span class="icon x-fa {iconCls}" style="color:{color};"></span></p>
                <p class="caption">{text}</p>
            `,
            listeners:{
                childtap: 'onMenuItemTap'
            }
        },
    ]
});