Ext.define('Test.store.identity.Roles', {
    extend: 'Common.core.data.Store',
    alias: 'store.identity.roles',

    requires:[
        'Test.model.identity.Role'
    ],

    model: 'Test.model.identity.Role',
    sorters:'name'

});