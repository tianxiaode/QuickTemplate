Ext.define('Common.Data.model.Base', {
    extend: 'Ext.data.Model',

    requires: [
        'Ext.data.identifier.Negative'
    ],

    fields: [
        { name: 'id', type: 'int' }
    ],
    idProperty: 'id',

    identifier: 'negative',
    schema: {
        namespace: 'Common.Data.model'
    }
});
