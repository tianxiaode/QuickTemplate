Ext.define('Phone.view.identity.roles.Role', {
    extend: 'Common.ux.crud.container.Phone',
    xtype : 'roleview', 

    hasCountMessage: false,
    
    requires:[
        'Common.ux.crud.List',
        'Common.view.identity.roles.Model',
        'Common.view.identity.roles.Controller',
        'Phone.view.identity.roles.RoleItem'
    ],


    controller: 'rolecontroller',
    viewModel: 'rolemodel',

    items:[
        {
            xtype: 'uxcrudlist',            
            autoLoad: true,
            hasPaging: false,
            hasCheckbox: true,
            itemConfig:{
                xtype: 'phone-roleitem'
            },
        }
    ]
});