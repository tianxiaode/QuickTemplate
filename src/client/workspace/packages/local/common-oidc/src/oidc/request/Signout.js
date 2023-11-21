Ext.define('Common.oidc.request.Signout', {
    alias: 'oidc.request.signout',

    /**
     * @public
     * @see https://openid.net/specs/openid-connect-rpinitiated-1_0.html#RPLogout
     */

    // mandatory
    url: null,
    state: null,

    // optional
    idTokenHint: null,
    clientId: null,
    postLogoutRedirectUri: null,
    extraQueryParams: null,

    // special
    requestType: null,
    /** custom "state", which can be used by a caller to have "data" round tripped */
    stateData: null,

    constructor(config) {
        let me = this,
            { url, stateData, idTokenHint, postLogoutRedirectUri, extraQueryParams, requestType, clientId } = config;

        if (!url) {
            Logger.error(me, "ctor: No url passed");
            throw new Error("url");
        }

        let parsedUrl = new URL(url);

        if (idTokenHint) {
            parsedUrl.searchParams.append("id_token_hint", idTokenHint);
        }

        if (clientId) {
            parsedUrl.searchParams.append("client_id", clientId);
        }
        if (postLogoutRedirectUri) {
            parsedUrl.searchParams.append("post_logout_redirect_uri", postLogoutRedirectUri);

            if (stateData) {
                me.state = Ext.create('oidc.state.state', { data: stateData, requestType });

                parsedUrl.searchParams.append("state", me.state.id);
            }
        }

        for (const [key, value] of Object.entries({ ...extraQueryParams })) {
            if (value != null) {
                parsedUrl.searchParams.append(Format.splitCamelCase(key, '_'), value.toString());
            }
        }

        me.url = parsedUrl.href;

    },

    destroy() {
        this.destroyMembers('state');
        this.callParent();
    }

})
