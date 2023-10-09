Ext.define('Test.model.identity.Role', {
    extend: 'Common.core.data.Model',
    alias: 'entity.identity.role',

    hasTranslation: true,
    fields: [
        { name: 'name', type: 'string', defaultValue: '', messageField: true, allowSort: true, langText: 'DisplayName:RoleName', isTranslation: true},
        { name: 'isStatic', type: 'bool', defaultValue: false},
        { name: 'isDefault', type: 'bool', defaultValue: false, updateAction: 'default', allowSort: true},
        { name: 'isPublic', type: 'bool', defaultValue: true, updateAction: 'public', allowSort: true}
    ]

});