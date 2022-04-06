Ext.define('Common.view.identity.users.Model',{
    extend: 'Ext.app.ViewModel',
    alias:'viewmodel.usermodel',

    requires:[
        'Common.data.store.identity.Users',
        'Common.view.identity.users.Edit',
    ],

    stores: {
        mainStore: {
            type: 'users'
        }
    },

    data:{
        entityName: 'User',
        resourceName: 'AbpIdentity',
        permissionGroup: 'AbpIdentity',
    }

})