Ext.define('Common.data.model.Base', {
    extend: 'Ext.data.Model',

    requires: [
        'Ext.data.identifier.Uuid'
    ],

    fields: [
        { name: 'id', type: 'string' },
        { name: 'concurrencyStamp', type: 'string', defaultValue: null},
    ],
    idProperty: 'id',

    identifier: 'uuid',
    
    schema: {
        namespace: 'Common.data.model'
    },

});
