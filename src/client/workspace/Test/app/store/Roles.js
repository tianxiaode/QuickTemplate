Ext.define('Test.store.Roles', {
    extend: 'Common.core.data.Store',
    alias: 'store.roles',

    requires:[
        'Test.model.Role'
    ],

    model: 'Test.model.Role',
    sorters:'name'

});