Ext.define('Common.view.identity.roles.Model',{
    extend: 'Ext.app.ViewModel',
    alias:'viewmodel.rolemodel',

    requires:[
        'Common.data.store.identity.Roles'
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