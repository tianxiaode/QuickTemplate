Ext.define('Common.data.model.identity.User', {
    extend: 'Common.data.model.Base',
    alias: 'entity.user',

    fields: [
        { name: 'userName', defaultValue: '', messageField: true, allowSort: true},
        { name: 'name', defaultValue: '', allowSort: false},
        { name: 'surname', defaultValue: '', allowSort: false},
        { name: 'email', defaultValue: '', allowSort: true},
        { name: 'phoneNumber', defaultValue: '', allowSort: true},
        { name: 'phoneNumber', defaultValue: '', allowSort: true},
        { name: 'isActive', type: 'bool', defaultValue: false, updateAction: 'active', allowSort: true},
        { name: 'lockoutEnabled', type: 'bool', defaultValue: false, updateAction: 'lockoutEnabled', allowSort: true},
        { name: 'lockoutEnd', type: 'date', dateFormat:  'C', defaultValue: null, updateAction: 'lockout', allowSort: true },
    ],

})