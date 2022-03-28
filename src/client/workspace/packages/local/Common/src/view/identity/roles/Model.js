Ext.define('Common.view.identity.roles.Model',{
    extend: 'Ext.app.ViewModel',
    alias:'viewmodel.rolemodel',

    requires:[
        'Common.data.store.identity.Roles',
        'Common.view.identity.roles.Edit',
        'Common.view.identity.roles.Multilingual',
    ],

    stores: {
        mainStore: {
            type: 'roles'
        }
    },

    data:{
        entityName: 'Role',
        resourceName: 'AbpIdentity',
        permissionGroup: 'AbpIdentity',
    }

})