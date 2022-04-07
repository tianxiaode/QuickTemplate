Ext.define('Common.data.model.identity.UserRole', {
    extend: 'Common.data.model.TranslationBase',
    alias: 'entity.userrole',
   
    fields: [
        { name: 'name', defaultValue: '', messageField: true, allowSort: true},
        { name: 'isSelected', type: 'bool', defaultValue: false},
    ],

})