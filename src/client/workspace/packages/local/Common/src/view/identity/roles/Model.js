Ext.define('Common.view.identity.roles.Model',{
    extend: 'Ext.app.ViewModel',
    alias:'viewmodel.rolemodel',

    requires:[
        'Common.data.store.identity.Roles',
        'Common.view.identity.roles.Edit',
        'Common.ux.multilingual.Form',
    ],

    stores: {
        mainStore: {
            type: 'roles'
        }
    },

})