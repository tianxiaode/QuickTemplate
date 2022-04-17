Ext.define('Phone.view.identity.users.User', {
    extend: 'Common.ux.crud.container.Phone',
    xtype : 'phone-userview', 
    
    requires:[
        'Common.ux.crud.List',
        'Common.view.identity.users.Model',
        'Common.view.identity.users.Controller',
        'Phone.view.identity.users.UserItem',
        'Phone.view.identity.users.More',
    ],
 
    controller: 'usercontroller',
    viewModel: 'usermodel',
    childTap: true,
    entityName: 'User',
    resourceName: 'AbpIdentity',

    list:{
        autoLoad: true,
        hasCheckbox: true,
        itemConfig:{
            xtype: 'phone-useritem'
        },
    }
});