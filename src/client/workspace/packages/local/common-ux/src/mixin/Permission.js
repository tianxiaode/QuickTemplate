Ext.define('Common.mixin.Permission',{
    extend: 'Common.mixin.Base',

    config: {
        entityName: null,        
        permissionGroup: null,
        permissions: ['create', 'update', 'delete']
    },


    updateEntityName(){
        this.initPermissions();
    },

    updatePermissionGroup(){
        this.initPermissions();
    },

    applyPermissions(permissions){
        permissions = Ext.clone(permissions);
        if(Ext.isArray(permissions)){
            //数组转换为对象            
            permissions = permissions.reduce((result, p) => {
                result[p] = false;
                return result;     
            }, {});
        }

        return permissions;
    },

    updatePermissions(){
        this.initPermissions();
    },

    initPermissions(){
        let me = this,
            c = Ext.String.capitalize,
            entityName = me.getEntityName(),
            group = me.getPermissionGroup(),
            permissions = me.getPermissions();
        if(Ext.isEmpty(entityName) || Ext.isEmpty(group) || Ext.isEmpty(permissions)) return;
        Ext.Object.each(permissions, (permissionName, value) => {
            let permission = `${c(group)}.${c(Ext.util.Inflector.pluralize(entityName))}.${c(permissionName)}`;
            permissions[permissionName] = ACL.isGranted(permission);
        });
    },

    doDestroy(){
        this.destroyMembers('permissions', 'entityName', 'permissionGroup');
    }
})
