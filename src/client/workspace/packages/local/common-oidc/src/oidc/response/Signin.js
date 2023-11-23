/**
 * @
 * @see https://openid.net/specs/openid-connect-core-1_0.html#AuthResponse
 * @see https://openid.net/specs/openid-connect-core-1_0.html#AuthError
 */

Ext.define('Common.oidc.response.Signin', {
    alias: 'oidc.response.signin',

    oidcScope: 'openid',

    // props present in the initial callback response regardless of success
    state: null,
    /** @see {@link User.session_state} */
    sessionSstate: null,

    // error props
    /** @see {@link ErrorResponse.error} */
     error: null,
    /** @see {@link ErrorResponse.error_description} */
     errorDescription: null,
    /** @see {@link ErrorResponse.error_uri} */
     errorUri: null,

    // success props
     code: null,

    // props set after validation
    /** @see {@link User.id_token} */
    idToken: null,
    /** @see {@link User.access_token} */
    accessToken: null,
    /** @see {@link User.token_type} */
    tokenType: null,
    /** @see {@link User.refresh_token} */
    refreshToken: null,
    /** @see {@link User.scope} */
    scope: null,
    /** @see {@link User.expires_at} */
    expiresAt: undefined,

    /** custom state data set during the initial signin request */
    userState: null,

    /** @see {@link User.profile} */
     profile: null,

    constructor(params) {
        let me = this,
            delimiter = Oidc.Url.URL_STATE_DELIMITER;
        me.state = params.get("state");
        me.sessionState = params.get("session_state");

        if (me.state) {
            let splitState = decodeURIComponent(me.state).split(delimiter);
            me.state = splitState[0];
            if (splitState.length > 1) {
                me.urlState = splitState.slice(1).join(delimiter);
            }
        }

        me.error = params.get("error");
        me.errorDescription = params.get("error_description");
        me.errorUri = params.get("error_uri");

        me.code = params.get("code");

    },

    getExpiresIn(){
        if (!this.expiresAt) {
            return undefined;
        }
        return this.expiresAt -  Oidc.Timer.getEpochTime();

    },

    setExpiresIn(value){
        if (typeof value === "string") value = Number(value);
        if (value !== undefined && value >= 0) {
            this.expiresAt = Math.floor(value) +  Oidc.Timer.getEpochTime();
        }
    },

    isOpenId()
    {
        return this.scope?.split(" ").includes(this.oidcScope) || !!this.idToken;
    },

    destroy() {
        this.destroyMembers('state');
        this.callParent();
    }

})
