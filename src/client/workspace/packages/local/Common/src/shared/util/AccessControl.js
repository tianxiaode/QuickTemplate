Ext.define('Common.shared.util.AccessControl',{
    alternateClassName: 'ACL',
    singleton: true,

    config:{
        policies: null,
        grantedPolicies: null
    },


    constructor: function (config) {
        const me = this;
        me.initConfig(config);
        Ext.on('configisready', me.setData, me)
    },

    isGranted: function(permissionName){
        let v = this.setGrantedPolicies()[permissionName];
        return  v === "true" || v === true  || false;
    },

    privates:{
        setData(data){
            const me = this;
            me.setPolicies(Object.assign({}, data.auth.policies) );
            me.setGrantedPolicies(Object.assign({},data.auth.grantedPolicies));
            console.log(me.getPolicies())
            console.log(me.getGrantedPolicies());
        }
    }

});