Ext.define('Common.overrides.Component',{
    override: 'Ext.Component',


    mixins: [
        'Ext.mixin.Responsive'
    ],

    config:{
        entityName: null,
        permissionGroup: null,
        permissions: null
    },

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
    }

})