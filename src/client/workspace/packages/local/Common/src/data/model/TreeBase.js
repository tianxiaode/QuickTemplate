Ext.define('Common.data.model.TreeBase', {
    extend: 'Common.data.model.Base',


    fields: [
        { name: 'displayName',type: 'string', defaultValue: '' , messageField: true},        
        { name: 'code',type: 'string', defaultValue: ''},
        { name: 'parentId', type: 'string', defaultValue: null },
        { name: 'parent'}
    ],

});
