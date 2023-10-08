Ext.define('Test.spec.common.core.data.Roles2', {
    extend: 'Common.core.data.Store',
    alias: 'store.roles2',

    requires:[
        'Test.spec.common.core.data.Role2'
    ],

    model: 'Test.spec.common.core.data.Role2',
    sorters:'name'

});