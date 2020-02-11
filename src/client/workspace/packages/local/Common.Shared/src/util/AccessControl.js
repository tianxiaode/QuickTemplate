/**
 * 访问控制类
 * 
 **/ 

Ext.define('Common.Shared.util.AccessControl',{
    alternateClassName: 'ACL',
    singleton: true,

    config:{
        /**
         * 系统的全部权限
         */
        allPermissions: null,

        /**
         * 用户的权限
         */
        grantedPermissions: null
    },


    constructor: function (config) {
        this.initConfig(config);
        this.callParent(arguments);
    },

    /**
     * 判断用户是否具有指定的权限
     * @param {权限名称} permissionName 
     */
    isGranted: function(permissionName){
        let v = this.getGrantedPermissions()[permissionName];
        return  v === "true" || v === true  || false;
    },

    /**
     * 获取权限显示名称
     * @param {权限名称} permission 
     */
    getDisplayName: function(permission){
        return this.getAllPermissions()[permission];
    }

});