Ext.define('Common.data.model.District', {
    extend: 'Ext.data.Model',

    fields: [
        { name: 'text', type: 'string', defaultValue: '' },
        { name: 'code', type: 'string', defaultValue: '' },
        { name: 'parent', type: 'string', defaultValue: '' }
    ],

    idProperty: 'code',
        
})