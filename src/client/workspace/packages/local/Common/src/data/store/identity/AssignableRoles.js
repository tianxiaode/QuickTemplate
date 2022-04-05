Ext.define('Common.data.store.identity.AssignableRoles',{
    extend: 'Common.ux.data.Store',
    alias: 'store.assignableroles',

    requires:[
        'Common.data.model.identity.AssignableRole',
    ],

    model: 'Common.data.model.identity.AssignableRole',
    sorters:'name',
})