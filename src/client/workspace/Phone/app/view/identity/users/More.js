Ext.define('Phone.view.identity.users.More', {
    extend: 'Common.view.identity.users.More',
    xtype : 'phone-usermoreview', 
    
    requires:[
        'Common.view.identity.users.MoreModel',
        'Phone.view.identity.users.Details',
    ],

    resizable: null,
    viewModel: 'usermoremodel',
    hasBack: true,

    tabs:[
        {  
            langText: 'User',
            pageType: 'phone-userdetails',
            pageItemId: 'detail',
        }
    ]
});