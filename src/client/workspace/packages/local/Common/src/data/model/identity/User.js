Ext.define('Common.data.model.identity.User', {
    extend: 'Common.data.model.Base',
    alias: 'entity.user',

    fields: [
        { name: 'userName',type: 'string', defaultValue: '', messageField: true, allowSort: true},
        { name: 'name', type: 'string',defaultValue: '', allowSort: false},
        { name: 'surname',type: 'string', defaultValue: '', allowSort: false},
        { name: 'email',type: 'string', defaultValue: '', allowSort: true},
        { name: 'phoneNumber',type: 'string', defaultValue: '', allowSort: true},
        { name: 'isActive', type: 'bool', defaultValue: true, updateAction: 'active', allowSort: true},
        { name: 'lockoutEnabled', type: 'bool', defaultValue: true, updateAction: 'lockable', allowSort: true, langText: 'Lockable'},
        { name: 'lockoutEnd', type: 'date', dateFormat:  'C', defaultValue: null, updateAction: 'lockout', allowSort: true, langText: 'UserLocked' },
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