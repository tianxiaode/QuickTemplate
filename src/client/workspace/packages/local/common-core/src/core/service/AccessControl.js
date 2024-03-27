Ext.define('Common.core.service.AccessControl',{
    alternateClassName: 'ACL',
    singleton: true,

    requires:[
        'Common.core.service.Config'
    ],


    isGranted(permissionName){
        let policies = Config.getGrantedPolicies(),
            v = policies && policies[permissionName];            
        return  v === "true" || v === true  || false;
    },

    // getDisplayName(permission){
    //     return this.getPolicies()[permission];
    // },

    // init(){        
    //     let me = this,
    //         auth = Config.getGrantedPolicies();
    //     if(!auth) return;
    //     me.setPolicies(Object.assign({}, auth.grantedPolicies) );
    //     me.setGrantedPolicies(Object.assign({},auth.grantedPolicies));
    // },

    destroy() {
        // let me = this;
        // me.setPolicies(null);
        // me.setGrantedPolicies(null);
        // me.callParent();
    }



});