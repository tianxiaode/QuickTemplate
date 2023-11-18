Ext.define('Common.oidc.ClientSettingsStore', {
    alias: 'oidc.clientsettingsstore',

    // metadata
    authority: null,
    metadataUrl: null,
    metadata: null,
    metadataSeed: null,
    signingKeys: null,

    // client config
    clientId: null,
    clientSecret: null,
    responseType:  'code',
    scope: 'openid',
    redirectUri: null,
    postLogoutRedirectUri: null,
    clientAuthentication: 'client_secret_post',

    // optional protocol params
    prompt: null,
    display: null,
    maxAge: null,
    uiLocales: null,
    acrValues: null,
    resource: null,
    responseMode: 'query',

    // behavior flags
    filterProtocolClaims: true,
    loadUserInfo: false,
    staleStateAgeInSeconds: 60 * 15,
    clockSkewInSeconds: 60 * 5,
    userInfoJwtIssuer: null,
    mergeClaims: false,

    stateStore: null,

    // extra
    extraQueryParams: null,
    extraTokenParams: null,
    extraHeaders: null,

    revokeTokenAdditionalContentTypes: null,
    fetchRequestCredentials: null,
    refreshTokenAllowedScope: null,
    disablePKCE: false,

    constructor(config){
        let me = this;
        Ext.apply(me, config);
        me.extraQueryParams = me.extraQueryParams || {};
        me.extraTokenParams = me.extraTokenParams || {};
        me.extraHeaders = me.extraHeaders || {};
        if(!me.metadataUrl){
            me.metadataUrl = me.authority;
            if(me.authority){
                if (!me.metadataUrl.endsWith("/")) {
                    me.metadataUrl += "/";
                }
                me.metadataUrl += ".well-known/openid-configuration";
            }
        }

        if (me.fetchRequestCredentials && me.refreshTokenCredentials) {
            Logger.warn(me, "Both fetchRequestCredentials and refreshTokenCredentials is set. Only fetchRequestCredentials will be used.");
        }
        me.fetchRequestCredentials = me.fetchRequestCredentials ? me.fetchRequestCredentials
            : me.refreshTokenCredentials ? me.refreshTokenCredentials : "same-origin";
    },

    destroy() {
        this.destroyMembers('extraQueryParams', 'extraTokenParams', 'extraHeaders', 'metadata', 'signingKeys', 'metadataSeed');
        this.callParent();
    }


});
