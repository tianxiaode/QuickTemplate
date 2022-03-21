Ext.define('Common.service.AccessControl',{
    alternateClassName: 'ACL',
    singleton: true,

    requires:[
        'Common.service.Config'
    ],

    config:{
        policies: null,
        grantedPolicies: null
    },


    constructor(config) {
        let me = this;
        me.initConfig(config);
        Config.isReady && me.setData();
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
        setData(){
            let me = this,
                auth = Config.getAuthData();
            if(!auth) return;
            me.setPolicies(Object.assign({}, auth.policies) );
            me.setGrantedPolicies(Object.assign({},auth.grantedPolicies));
        }
    }

});