Ext.define('Common.data.model.TreeSearch', {
    extend: 'Common.data.model.Base',

    fields: [
        { name: 'displayName',type: 'string', defaultValue: '', messageField: true },
        { name: 'code',type: 'string', defaultValue: ''},
        { name: 'parentId', type: 'string', defaultValue: null },
        { name: 'parentName',type: 'string', defaultValue: '' },
        { name: 'parent', defaultValue: null },
        { name: 'isStatic', type: 'boolean', defaultValue: false},
    ]
        
})