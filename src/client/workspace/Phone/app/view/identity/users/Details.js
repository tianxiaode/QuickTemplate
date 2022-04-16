Ext.define('Phone.view.identity.users.Details', {
    extend: 'Ext.Container',
    xtype : 'phone-userdetails', 
    
    requires:[
        'Common.ux.dataview.DetailList',
        'Phone.view.identity.users.Edit',
        'Phone.view.identity.users.DetailController',
    ],

    controller: 'phone-userdetailcontroller',
    layout: 'vbox',

    items: [
        {
            xtype: 'uxdetaillist',
            scrollable: true,
            flex: 1,
            fields: ['userName', 'name', 'surname', 'email',  'phoneNumber', 'creationTime','isActive', 
                { name: 'lockoutEnabled', label: 'lockable' },
                { name: 'lockoutEnd', label: 'UserLocked' }
            ],
        },        
    ]
});