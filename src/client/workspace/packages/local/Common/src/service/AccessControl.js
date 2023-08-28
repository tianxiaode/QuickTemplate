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
        Config.on('ready', me.init, me);
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
        console.log('acl init')
        if(!auth) return;
        me.setPolicies(Object.assign({}, auth.grantedPolicies) );
        me.setGrantedPolicies(Object.assign({},auth.grantedPolicies));
    },

    doDestroy() {
        let me = this;
        me.setPolicies(null);
        me.setGrantedPolicies(null);
    }



});