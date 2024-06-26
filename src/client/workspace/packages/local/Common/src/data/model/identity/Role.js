Ext.define('Common.data.model.identity.Role', {
    extend: 'Common.data.model.Base',
    alias: 'entity.role',

    hasTranslation: true,

    fields: [
        { name: 'name', type: 'string', defaultValue: '', messageField: true, sortable: true, langText: 'DisplayName:RoleName', isTranslation: true},
        { name: 'permissions' , defaultValue: []},
        { name: 'isStatic', type: 'bool', defaultValue: false},
        { name: 'isDefault', type: 'bool', defaultValue: false, updateAction: 'default', sortable: true},
        { name: 'isPublic', type: 'bool', defaultValue: true, updateAction: 'public', sortable: true},
        { 
            name: 'displayPermissions', 
            calculate(data){
                let permissions = data.permissions ;
                if(!Ext.isArray(permissions)) return;
                let resourceName = 'Permissions',
                    result = [],
                    temp = {};
                permissions.forEach(p=>{
                    let start = p.indexOf('.'),
                        last = p.lastIndexOf('.');
                    if(start === last) {
                        temp[p] = [];
                    }else{
                        let text = `Permission:${p.substr(last+1)}`;  
                        if(!p.includes('ManagePermissions')) temp[p.substr(0,last)].push(I18N.get(text,resourceName))
                    };                        
                });
                Ext.iterate(temp, (key, value)=>{
                    let main = I18N.get(key,resourceName);
                    if(!Ext.isEmpty(value)){
                        main = `${main}(${value.join(',')})`;
                    }
                    result.push(main)

                })
                return result;
            }
        },
    ],

})