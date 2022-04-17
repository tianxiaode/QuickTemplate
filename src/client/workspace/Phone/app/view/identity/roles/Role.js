Ext.define('Phone.view.identity.roles.Role', {
    extend: 'Common.ux.crud.container.Phone',
    xtype : 'roleview', 

    requires:[
        'Common.ux.crud.List',
        'Common.view.identity.roles.Model',
        'Common.view.identity.roles.Controller',
        'Phone.view.identity.roles.RoleItem'
    ],


    controller: 'rolecontroller',
    viewModel: 'rolemodel',
    childTap: true,
    entityName: 'Role',
    resourceName: 'AbpIdentity',

    list:{
        autoLoad: true,
        hasCheckbox: true,
        itemConfig:{
            xtype: 'phone-roleitem'
        },
    }
});