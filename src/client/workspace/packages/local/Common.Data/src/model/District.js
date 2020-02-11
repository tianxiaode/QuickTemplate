Ext.define('Common.Data.model.District', {
    extend: 'Common.Data.model.Base',

    fields: [
        { name: 'text', type: 'string', defaultValue: '' },
        { name: 'code', type: 'string', defaultValue: '' },
        { name: 'parent', type: 'string', defaultValue: '' }
    ]
        
})