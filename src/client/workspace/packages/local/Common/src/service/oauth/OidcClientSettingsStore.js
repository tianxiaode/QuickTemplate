Ext.define('Common.service.oauth.OidcClientSettingsStore',{

      authority:null,
      metadataUrl: null,
      metadata: undefined,
      metadataSeed:  undefined,
      signingKeys: null,

    // client config
      client_id: null,
      client_secret: undefined,
      response_type: null,
      scope: null,
      redirect_uri: null,
      post_logout_redirect_uri: undefined,
      client_authentication: "client_secret_basic" | "client_secret_post",

    // optional protocol params
      prompt:  undefined,
      display: undefined,
      max_age: undefined,
      ui_locales: undefined,
      acr_values: undefined,
      resource: undefined,
      response_mode: "query" | "fragment",

    // behavior flags
      filterProtocolClaims: undefined,
      loadUserInfo: false,
      staleStateAgeInSeconds: null,
      clockSkewInSeconds: null,
      userInfoJwtIssuer: null, /*"ANY" | "OP" |*/ 
      mergeClaims: false,

      stateStore: null,

    // extra
      extraQueryParams: undefined,
      extraTokenParams: undefined,
      extraHeaders: undefined,

      revokeTokenAdditionalContentTypes: undefined,
      fetchRequestCredentials: undefined,
      refreshTokenAllowedScope: undefined,
      disablePKCE: false,

    constructor(config) {
        let me = this;
        Ext.apply(me, config);        
        
        if (!me.metadataUrl) {
            me.metadataUrl = me.authority;
            if (me.authority) {
                if (!me.metadataUrl.endsWith("/")) {
                    me.metadataUrl += "/";
                }
                me.metadataUrl += ".well-known/openid-configuration";
            }
        }

        if (fetchRequestCredentials && refreshTokenCredentials) {
            console.warn("Both fetchRequestCredentials and refreshTokenCredentials is set. Only fetchRequestCredentials will be used.");
        }
        me.fetchRequestCredentials = mefetchRequestCredentials ? mefetchRequestCredentials
            : me.refreshTokenCredentials ? me.refreshTokenCredentials : "same-origin";

        me.stateStore = AppStorage;

    },


    destroy() {
        this.destroyMembers('stateStore', 'metadata', 'metadataSeed', 
            'resource', 'filterProtocolClaims', 'extraQueryParams', 'extraTokenParams', 
            'extraHeaders', 'revokeTokenAdditionalContentTypes', 'fetchRequestCredentials');
    }

})