Ext.define('Common.data.model.TreeBase', {
    extend: 'Ext.data.TreeModel',

    requires: [
        'Ext.data.identifier.Negative'
    ],

    fields: [
        { name: 'id', type: 'string' },
        { name: 'displayName',type: 'string', defaultValue: '' , messageField: true},
        { name: 'code',type: 'string', defaultValue: ''},
        { name: 'parentId', type: 'string', defaultValue: null },
        { name: 'parentName',type: 'string', defaultValue: '' },
        { name: 'isStatic', type: 'boolean', defaultValue: false},
        { name: 'isMunicipality', type: 'boolean', defaultValue: false},
    ],
    idProperty: 'id',

    identifier: {
        type: 'negative',
        seed: -1000
    }
});
