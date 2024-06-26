Ext.define('Common.data.store.identity.Users',{
    extend: 'Common.core.data.Store',
    alias: 'store.users',

    requires:[
        'Common.data.model.identity.User'
    ],

    model: 'Common.data.model.identity.User',
    sorters: {
        property: 'creationTime', direction: 'DESC'
    }
})