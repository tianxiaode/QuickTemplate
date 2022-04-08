Ext.define('Common.ux.crud.controller.mixin.ResourceAndPermission',{
    extend: 'Ext.Mixin',

    mixinConfig: {
        configs: true,
        before:{
            init: 'init'
        }
    },

    entityName: null, //实体
    resourceName: null, //资源
    isPhone: false, //是否手机平台
    permissionGroup: null, //权限组
    permissionName: null, //权限名
    permissions:{
        create: 'Create',
        update: 'Update',
        delete: 'Delete'
    },
    
    init(){
        let me = this;
        me.isPhone = Ext.platformTags.phone;
        me.initResource(me);
        me.initPermission(me);
    },

    initResource(me){
        let names = ['entityName', 'resourceName', 'permissionGroup', 'permissionName'],
            view = me.getView();
        view = view.includeResource ? view : view.up('[includeResource]');
        names.forEach(n=>{
            let value = me[n];
            if(!Ext.isEmpty(value)) return;
            value = me.getViewModelValue(n) || view[n];
            if(Ext.isEmpty(value) && n === 'permissionName') value = Format.pluralize(me.entityName);
            if(Ext.isEmpty(value)) Ext.raise(`No ${n}`);
            me[n] = Format.capitalize(value);
        });
    },

    initPermission(me){
        let entityName = me.entityName,
            permissions= {};
        Ext.iterate(me.permissions, (k,v)=>{
            permissions[k] = `${me.permissionGroup || entityName}.${ me.permissionName || Format.pluralize(entityName)}.${v}`;
        })
        me.permissions = permissions;

    },

    isGranted(name){
        return ACL.isGranted(this.permissions[name]);
    }

    
})
