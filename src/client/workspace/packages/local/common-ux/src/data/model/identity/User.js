Ext.define('Common.data.model.identity.User', {
    extend: 'Common.data.model.Base',
    alias: 'entity.abpIdentity.user',

    fields: [
        { name: 'userName',type: 'string', defaultValue: '', isMessage: true, sortable: true},
        { name: 'name', type: 'string',defaultValue: '', sortable: false},
        { name: 'surname',type: 'string', defaultValue: '', sortable: false},
        { name: 'email',type: 'string', defaultValue: '', sortable: true},
        { name: 'phoneNumber',type: 'string', defaultValue: '', sortable: true },
        { name: 'isActive', type: 'bool', defaultValue: true, updateAction: 'active', sortable: true},
        { name: 'lockoutEnabled', type: 'bool', defaultValue: true, updateAction: 'lockable', sortable: true, langText: 'Lockable'},
        { name: 'lockoutEnd', type: 'date', dateFormat:  'C', defaultValue: null, updateAction: 'lockout', sortable: true, langText: 'UserLocked' },
        { name: 'creationTime', type: 'date', dateFormat:  'C', sortable: true,},
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