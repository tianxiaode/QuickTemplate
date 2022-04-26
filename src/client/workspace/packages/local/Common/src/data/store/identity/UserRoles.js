Ext.define('Common.data.store.identity.UserRoles',{
    extend: 'Common.ux.data.Store',
    alias: 'store.userroles',

    requires:[
        'Common.data.model.identity.UserRole'
    ],

    model: 'Common.data.model.identity.UserRole',
    sorters:'name',
})