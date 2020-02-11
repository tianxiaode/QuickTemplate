Ext.define('Common.Data.model.SearchTree', {
    extend: 'Common.Data.model.Base',

    fields: [
        { name: 'displayName',type: 'string', defaultValue: '', isDeleteMessageField: true },
        { name: 'code',type: 'string', defaultValue: ''},
        { name: 'parentId', type: 'int', defaultValue: null },
        { name: 'parentName',type: 'string', defaultValue: '' }
    ]
        
})