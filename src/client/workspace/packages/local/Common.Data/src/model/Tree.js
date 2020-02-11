Ext.define('Common.Data.model.Tree', {
    extend: 'Ext.data.TreeModel',

    requires: [
        'Ext.data.identifier.Negative'
    ],

    fields: [
        { name: 'id', type: 'int' },
        { name: 'displayName',type: 'string', defaultValue: '' , isDeleteMessageField: true},
        { name: 'code',type: 'string', defaultValue: ''},
        { name: 'parentId', type: 'int', defaultValue: null },
        { name: 'parentName',type: 'string', defaultValue: '' }
    ],
    idProperty: 'id',

    identifier: {
        type: 'negative',
        seed: -1000
    }
       
})