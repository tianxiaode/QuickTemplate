Ext.define('Common.core.service.AccessControl',{
    alternateClassName: 'ACL',
    singleton: true,

    requires:[
        'Common.core.service.Config'
    ],

    config:{
        policies: null,
        grantedPolicies: null
    },


    constructor(config) {
        let me = this;
        me.initConfig(config);
    },

    isGranted(permissionName){
        let policies = this.getGrantedPolicies(),
            v = policies && policies[permissionName];            
        return  v === "true" || v === true  || false;
    },

    getDisplayName(permission){
        return this.getPolicies()[permission];
    },

    init(){        
        let me = this,
            auth = Config.getAuthData();
        if(!auth) return;
        me.setPolicies(Object.assign({}, auth.grantedPolicies) );
        me.setGrantedPolicies(Object.assign({},auth.grantedPolicies));
    },

    destroy() {
        let me = this;
        me.setPolicies(null);
        me.setGrantedPolicies(null);
        me.callParent();
    }



});