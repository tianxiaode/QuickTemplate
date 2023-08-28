Ext.define('Common.mixin.controller.ResourceAndPermissions', {
    extend: 'Ext.Mixin',

    mixinConfig: {
        configs: true,
        before: {
            init: 'init',
            destroy: 'destroy'
        }
    },

    entityName: null, //实体
    resourceName: null, //资源
    isPhone: false, //是否手机平台
    permissions: null,

    init() {
        let me = this;
        me.isPhone = Ext.platformTags.phone;
        me.initResourceAndPermissions(me);
    },

    initResourceAndPermissions(me) {
        let view = me.getView();
        //console.log('initResourceAndPermissions', view.xtype, view.getPermissions());
        me.entityName = view.getEntityName();
        me.resourceName = view.getResourceName();
        me.permissions = view.getPermissions();
    },


    destroy() {
        this.permissions = null;
    }



})
