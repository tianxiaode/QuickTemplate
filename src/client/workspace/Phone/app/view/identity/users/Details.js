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
            fields: [ 
                'userName', 
                { name:'name', inputType: 'text' },
                { name: 'surname', inputType: 'text' },
                { name: 'email',  inputType: 'email'},
                { name: 'phoneNumber', inputType: 'text'},
                'creationTime',
                { name: 'isActive', inputType: 'bool' },
                { name: 'lockoutEnabled', label: 'lockable' , inputType: 'bool'},
                { name: 'lockoutEnd', label: 'UserLocked' , inputType: 'bool'}
            ],
        },        
    ]
});