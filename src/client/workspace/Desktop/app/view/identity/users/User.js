Ext.define('Desktop.view.identity.users.User', {
    extend: 'Ext.Container',
    xtype : 'desktop-userview', 

    requires:[
        'Desktop.view.identity.users.Crud',
        'Common.view.identity.users.Model'
    ],

    layout: 'hbox',
    viewModel: 'usermodel',
    includeResource: true,
    
    items: [
        {
            xtype: 'desktop-usercrudview',
            flex: 1
        },
        {

        }
    ]
});