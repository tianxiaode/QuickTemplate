Ext.define('Common.data.model.identity.UserRole', {
    extend: 'Common.data.model.identity.Role',
    alias: 'entity.abpIdentity.userrole',
   
    fields: [
        { name: 'isSelected', type: 'bool', defaultValue: false},
    ],

})