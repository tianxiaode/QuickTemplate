/**
 * @public
 * @see https://openid.net/specs/openid-connect-core-1_0.html#AuthError
 */

Ext.define('Common.oidc.response.Signout', {
    alias: 'oidc.response.signout',

    oidcScope: 'openid',

    // props present in the initial callback response regardless of success
    state: null,

    // error props
    /** @see {@link ErrorResponse.error} */
     error: null,
    /** @see {@link ErrorResponse.error_description} */
     errorDescription: null,
    /** @see {@link ErrorResponse.error_uri} */
     errorUri: null,

    /** custom state data set during the initial signin request */
    userState: null,

    constructor(params) {
        let me = this;
        me.state = params.get("state");
        me.sessionState = params.get("session_state");

        me.error = params.get("error");
        me.errorDescription = params.get("error_description");
        me.errorUri = params.get("error_uri");

    },

    destroy() {
        this.destroyMembers('state');
        this.callParent();
    }

})
