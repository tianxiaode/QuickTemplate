Ext.define('Common.data.model.identity.User', {
    extend: 'Common.data.model.Base',
    alias: 'entity.user',

    fields: [
        { name: 'userName', defaultValue: '', messageField: true, allowSort: true},
        { name: 'name', defaultValue: '', allowSort: false},
        { name: 'surname', defaultValue: '', allowSort: false},
        { name: 'email', defaultValue: '', allowSort: true},
        { name: 'phoneNumber', defaultValue: '', allowSort: true},
        { name: 'isActive', type: 'bool', defaultValue: true, updateAction: 'active', allowSort: true},
        { name: 'lockoutEnabled', type: 'bool', defaultValue: true, updateAction: 'lockable', allowSort: true},
        { name: 'lockoutEnd', type: 'date', dateFormat:  'C', defaultValue: null, updateAction: 'lockout', allowSort: true },
        { name: 'creationTime', type: 'date', dateFormat:  'C', allowSort: true,},
        { 
            name: 'fullName',
            calculate(data){
                let current = I18N.getCurrentLanguage()
                    isZh = current.includes('zh'),
                    resource = 'AbpIdentity',
                    surname = data.surname || `[${I18N.get('Surname', resource)}]`,
                    name = data.name || `[${I18N.get('name', resource)}]`,
                    fullName = isZh ? `${surname}${name}` : `${name} ${surname}`;
                return fullName;

            }
        }
    ],

})