Ext.define('Common.oidc.state.Refresh',{
    alias: 'oidc.state.refresh',

     data: null,

     refreshToken:null,
     idToken: null,
     sessionState: null,
     scope: null,
     profile: null,
     resource: null,


    constructor(config, resource){
        let me = this;        
        me.refreshToken = config.refreshToken;
        me.idToken = config.idToken;
        me.sessionState = config.sessionState;
        me.scope = config.scope;
        me.profile = config.profile;
        me.resource = resource;

        me.data = config.state;

    },

    destroy() {
        this.destroyMembers('resource', 'scope', 'profile', 'data');
        this.callParent();
    }

});
