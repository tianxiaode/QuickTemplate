Ext.define('Common.shared.service.AccessControl',{
    alternateClassName: 'ACL',
    singleton: true,

    requires:[
        'Common.shared.service.Config'
    ],

    config:{
        policies: null,
        grantedPolicies: null
    },


    constructor(config) {
        let me = this;
        me.initConfig(config);
        if(Config && Config.isReady) me.setData();
        Config.on('ready', me.setData, me)
    },

    isGranted(permissionName){
        let policies = this.getGrantedPolicies(),
            v = policies && policies[permissionName];
        return  v === "true" || v === true  || false;
    },

    getDisplayName(permission){
        return this.getPolicies()[permission];
    },


    privates:{
        setData(data){
            let me = this,
                auth = data.auth;
            if(!auth) return;
            me.setPolicies(Object.assign({}, auth.allPermissions) );
            me.setGrantedPolicies(Object.assign({},auth.grantedPermissions));
        }
    }

});