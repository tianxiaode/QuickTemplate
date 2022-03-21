Ext.define('Common.data.store.identity.Roles',{
    extend: 'Common.ux.data.Store',
    alias: 'store.roles',

    requires:[
        'Common.data.model.identity.Role',
    ],

    model: 'Common.data.model.identity.Role',
    pageSize: 0,
    sorters:'name',
    entity: ['identity/roles']
})