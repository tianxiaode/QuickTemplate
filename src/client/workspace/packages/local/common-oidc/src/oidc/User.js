Ext.define('Common.oidc.User',{
    alias: 'oidc.user',

    /**
     * A JSON Web Token (JWT). Only provided if `openid` scope was requested.
     * The application can access the data decoded by using the `profile` property.
     */
    idToken: undefined,

    /** The session state value returned from the OIDC provider. */
    sessionState: null,

    /**
     * The requested access token returned from the OIDC provider. The application can use this token to
     * authenticate itself to the secured resource.
     */
    accessToken: null,

    /**
     * An OAuth 2.0 refresh token. The app can use this token to acquire additional access tokens after the
     * current access token expires. Refresh tokens are long-lived and can be used to maintain access to resources
     * for extended periods of time.
     */
    refreshToken: null,

    /** Typically "Bearer" */
    tokenType: null,

    /** The scopes that the requested access token is valid for. */
    scope: null,

    /** The claims represented by a combination of the `id_token` and the user info endpoint. */
    profile: null,

    /** The expires at returned from the OIDC provider. */
    expiresAt: undefined,

    /** custom state data set during the initial signin request */
    state: null,

    statics:{
        fromStorageString(storageString){
            return Ext.create('oidc.user', JSON.parse(storageString));
        }    
    },

    constructor(config) {
        Ext.apply(this, config);
    },

    /** Computed number of seconds the access token has remaining. */
    getExpiresIn(){
        let me = this;
        if (!me.expiresAt) {
            return undefined;
        }
        return me.expiresAt - Oidc.Timer.getEpochTime();
    },

    setExpiresIn(value) {
        if (value !== undefined) {
            this.expiresAt = Math.floor(value) + Oidc.Timer.getEpochTime();
        }
    },

    /** Computed value indicating if the access token is expired. */
    isExpired(){
        let expiresIn = this.getExpiresIn();
        if (expiresIn === undefined) {
            return undefined;
        }
        return expiresIn <= 0;
    },

    /** Array representing the parsed values from the `scope`. */
    getScopes(){
        let scope = this.scope;
        return scope ? scope.split(" ") : [];
    },

    toStorageString() {
        let me = this;
        return JSON.stringify({
            idToken: me.idToken,
            sessionState: me.sessionState,
            accessToken: me.accessToken,
            refreshToken: me.refreshToken,
            tokenType: me.tokenType,
            scope: me.scope,
            profile: me.profile,
            expiresAt: me.expiresAt,
        });
    },

    destroy() {
        this.destroyMembers('defaultProtocolClaims', 'internalRequiredProtocolClaims', 'settings');
        this.callParent();
    }
    
})