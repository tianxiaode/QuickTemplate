Ext.define('Common.overrides.Component',{
    override: 'Ext.Component',


    mixins: [
        'Ext.mixin.Responsive'
    ],

    config:{
        entityName: null,
        permissionGroup: null,
    },

    permissions: null,

    updateEntityName(){
        this.initPermissions();
    },

    updatePermissionGroup(){
        this.initPermissions();
    },

    isPhone(){
        return Ext.platformTags.phone;
    },

    responsiveFormulas:{
        cancel(context){
            return this.initialConfig.cancelResponsive;
        }
    },

    initPermissions(){
        let me = this,
            entityName = me._entityName,
            resourceName = me._resourceName,
            group = me._permissionGroup || resourceName,
            permissionName = me.permissionName || entityName,
            permissions= {};
        if(Ext.isEmpty(permissionName) || Ext.isEmpty(group)) return;
        Logger.debug(this.initPermissions, group, permissionName, permissions, Format.defaultPermissions)
        Ext.isArray(me.permissions) && me.setPermissions(permissions, me.permissions, group, permissionName);
        me.setPermissions(permissions, Format.defaultPermissions, group, permissionName);
        me.permissions = permissions;
        me.isInitPermissions = true;
        //console.log(me.permissions)
    },

    setPermissions(permissions,actions, group , permissionName){
        group = Format.capitalize(group);
        permissionName = Format.capitalize(permissionName);
        actions.forEach(a=>{
            if(permissions[a]) return;
            let permission = `${group}.${Ext.util.Inflector.pluralize(permissionName) }.${a}`;
            Logger.debug(this.setPermissions, permission)
            permissions[a.toLowerCase()] = ACL.isGranted(permission);
        })
    },

    doDestroy(){
        this.permissions = null;
        this.callParent(arguments);
    }
    

})