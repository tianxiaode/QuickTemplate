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
    permissions: null,
    
    init(){
        let me = this;
        me.isPhone = Ext.platformTags.phone;
        me.initResourceAndPermissions(me);
    },

    initResourceAndPermissions(me){
        let names = ['entityName', 'resourceName', 'permissions'],
            view = me.getView();
        view = view.includeResource ? view : view.up('[includeResource]');
        names.forEach(n=>{
            let value = view[n];
            if(Ext.isEmpty(value) && n === 'permissions') Ext.raise('No permissions are defined');
            me[n] = value;
        });
    },

    isGranted(name){
        return ACL.isGranted(this.permissions[name]);
    }

    
})
