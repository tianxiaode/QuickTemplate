Ext.define('Common.oidc.setting.Client', {
    alias: 'oidc.setting.client',

    // metadata
    /** The URL of the OIDC/OAuth2 provider */
    authority: null,
    metadataUrl: null,
    /** Provide metadata when authority server does not allow CORS on the metadata endpoint */
    metadata: null,
    /** Can be used to seed or add additional values to the results of the discovery request */
    metadataSeed: null,
    /** Provide signingKeys when authority server does not allow CORS on the jwks uri */
    signingKeys: null,

    // client config
    /** Your client application's identifier as registered with the OIDC/OAuth2 */
    clientId: null,
    clientSecret: null,
    /** The type of response desired from the OIDC/OAuth2 provider (default: "code") */
    responseType:  'code',
    /** The scope being requested from the OIDC/OAuth2 provider (default: "openid") */
    scope: 'openid',
    /** The redirect URI of your client application to receive a response from the OIDC/OAuth2 provider */
    redirectUri: null,
    /** The OIDC/OAuth2 post-logout redirect URI */
    postLogoutRedirectUri: null,
    /**
     * Client authentication method that is used to authenticate when using the token endpoint (default: "client_secret_post")
     * - "client_secret_basic": using the HTTP Basic authentication scheme
     * - "client_secret_post": including the client credentials in the request body
     *
     * See https://openid.net/specs/openid-connect-core-1_0.html#ClientAuthentication
     */
    clientAuthentication: 'client_secret_post',

    // optional protocol params
    /** optional protocol param */
    prompt: null,
    /** optional protocol param */
    display: null,
    /** optional protocol param */
    maxAge: null,
    /** optional protocol param */
    uiLocales: null,
    /** optional protocol param */
    acrValues: null,
    /** optional protocol param */
    resource: null,
    /** optional protocol param (default: "query") */
    responseMode: 'query',

    // behavior flags
    /**
     * Should optional OIDC protocol claims be removed from profile or specify the ones to be removed (default: true)
     * When true, the following claims are removed by default: ["nbf", "jti", "auth_time", "nonce", "acr", "amr", "azp", "at_hash"]
     * When specifying claims, the following claims are not allowed: ["sub", "iss", "aud", "exp", "iat"]
    */
    filterProtocolClaims: true,
    /** Flag to control if additional identity data is loaded from the user info endpoint in order to populate the user's profile (default: false) */
    loadUserInfo: false,
    /** Number (in seconds) indicating the age of state entries in storage for authorize requests that are considered abandoned and thus can be cleaned up (default: 900) */
    staleStateAgeInSeconds: 60 * 15,
    /** @deprecated Unused */
    clockSkewInSeconds: 60 * 5,
    /** @deprecated Unused */
    userInfoJwtIssuer: null,
    /**
     * Indicates if objects returned from the user info endpoint as claims (e.g. `address`) are merged into the claims from the id token as a single object.
     * Otherwise, they are added to an array as distinct objects for the claim type. (default: false)
     */
    mergeClaims: false,

    /**
     * Storage object used to persist interaction state (default: window.localStorage, InMemoryWebStorage iff no window).
     * E.g. `stateStore: new WebStorageStateStore({ store: window.localStorage })`
     */
    stateStore: null,

    // extra
    /**
     * An object containing additional query string parameters to be including in the authorization request.
     * E.g, when using Azure AD to obtain an access token an additional resource parameter is required. extraQueryParams: `{resource:"some_identifier"}`
     */
    extraQueryParams: null,
    extraTokenParams: null,
    /**
     * An object containing additional header to be including in request.
     */
    extraHeaders: null,

    /**
     * @deprecated since version 2.1.0. Use fetchRequestCredentials instead.
     */
    refreshTokenCredentials: null,

    /**
     * Will check the content type header of the response of the revocation endpoint to match these passed values (default: [])
     */
    revokeTokenAdditionalContentTypes: null,

    /**
     * Sets the credentials for fetch requests. (default: "same-origin")
     * Use this if you need to send cookies to the OIDC/OAuth2 provider or if you are using a proxy that requires cookies
     */
    fetchRequestCredentials: null,

    /**
     * Only scopes in this list will be passed in the token refresh request.
     */
    refreshTokenAllowedScope: null,
    /**
     * Will disable pkce validation, changing to true will not append to sign in request code_challenge and code_challenge_method. (default: false)
     */
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

        if (!me.stateStore) {
            let store = typeof window !== "undefined" ? window.localStorage : Ext.create('oidc.storage.memory');
            me.stateStore = Ext.create('oidc.state.store', store);
        }
    
    },

    destroy() {
        this.destroyMembers('extraQueryParams', 'extraTokenParams', 'extraHeaders', 'metadata', 'signingKeys', 'metadataSeed');
        this.callParent();
    }


});
