Ext.define('Test.spec.common.core.data.Roles', {
    extend: 'Common.core.data.Store',
    alias: 'store.roles',

    requires:[
        'Test.spec.common.core.data.Role'
    ],

    model: 'Test.spec.common.core.data.Role',
    sorters:'name',

});