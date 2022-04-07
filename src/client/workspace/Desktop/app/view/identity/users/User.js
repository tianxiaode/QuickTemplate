Ext.define('Desktop.view.identity.users.User', {
    extend: 'Ext.Container',
    xtype : 'desktop-userview', 

    requires:[
        'Desktop.view.identity.users.Crud',
        'Common.view.identity.users.Model',
        'Common.view.identity.users.More',
        'Desktop.view.identity.users.UserController',
    ],

    layout: 'hbox',
    viewModel: 'usermodel',
    controller: 'desktop-usercontroller',
    includeResource: true,
    
    items: [
        {
            xtype: 'desktop-usercrudview',
            flex: 1
        },
        {
            xtype: 'usermoreview'
        }
    ]
});