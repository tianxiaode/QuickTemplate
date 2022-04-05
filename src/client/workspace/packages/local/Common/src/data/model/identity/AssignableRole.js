Ext.define('Common.data.model.identity.AssignableRole', {
    extend: 'Common.data.model.TranslationBase',
    alias: 'entity.assignablerole',
   
    fields: [
        { name: 'name', defaultValue: '', messageField: true, allowSort: true},
        { name: 'isChecked', type: 'bool', defaultValue: false},
    ],

})