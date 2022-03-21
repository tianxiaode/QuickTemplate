Ext.define('Common.data.model.identity.Role', {
    extend: 'Common.data.model.Base',
    alias: 'entity.role',
   
    fields: [
        { name: 'name', defaultValue: ''},
        { name: 'concurrencyStamp', defaultValue: null},
        { name: 'permissions' , defaultValue: []},
        { name: 'isStatic', type: 'bool', defaultValue: false},
        { name: 'isDefault', type: 'bool', defaultValue: false},
        { name: 'isPublic', type: 'bool', defaultValue: true},
        { 
            name: 'displayPermissions', 
            calculate(data){
                let permissions = data.permissions ;
                console.log(data.permissions);
                if(Ext.isArray(permissions)){
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
                    Object.keys(temp).forEach(k=>{
                        let main = I18N.get(k,resourceName);
                        if(temp[k].length>0){
                            main = `${main}(${temp[k].join(',')})`;
                        }
                        result.push(main)
                    })
                    return result;
                }
            }
        },
        {
            name: 'displayName',
            localFilter: true, messageField: true,
            calculate(data){
                return data.name;
            }
        }
    ],

})