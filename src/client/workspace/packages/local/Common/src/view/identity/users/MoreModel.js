Ext.define('Common.view.identity.users.MoreModel',{
    extend: 'Ext.app.ViewModel',
    alias:'viewmodel.usermoremodel',

    requires:[
        'Common.data.store.identity.UserRoles'
    ],

    stores: {
        userRoles: {
            type: 'userroles'
        }
    },

})