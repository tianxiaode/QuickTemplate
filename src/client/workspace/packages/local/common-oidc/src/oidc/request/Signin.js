Ext.define('Common.oidc.request.Signin', {
    alias: 'oidc.request.signin',

    /**
 * @public
 * @see https://openid.net/specs/openid-connect-core-1_0.html#AuthRequest
 */

    // mandatory
    url: null,
    authority: null,
    clientId: null,
    redirectUri: null,
    responseType: null,
    scope: null,

    // optional
    responseMode: null,
    nonce: null,
    display: null,
    prompt: null,
    maxAge: 0,
    uiLocales: null,
    idTokenHint: null,
    loginHint: null,
    acrValues: null,

    // other
    resource: null,
    request: null,
    requestUri: null,
    requestType: null,
    extraQueryParams: null,

    // special
    extraTokenParams: null,
    clientSecret: null,
    skipUserInfo: false,
    disablePKCE: false,
    /** custom "state", which can be used by a caller to have "data" round tripped */
    stateData: null,

    constructor(config) {
        let me = this,
            {
                // mandatory
                url, authority, clientId, redirectUri, responseType, scope,
                // optional
                stateSata, responseMode, requestType, clientSecret, nonce,
                resource,
                skipUserInfo,
                extraQueryParams,
                extraTokenParams,
                disablePKCE,
                ...optionalParams
            } = config;

        if (!url) {
            Logger.error(me, "ctor: No url passed");
            throw new Error("url");
        }
        if (!clientId) {
            Logger.error(me, "ctor: No client_id passed");
            throw new Error("client_id");
        }
        if (!redirectUri) {
            Logger.error(me, "ctor: No redirect_uri passed");
            throw new Error("redirect_uri");
        }
        if (!responseType) {
            Logger.error(me, "ctor: No response_type passed");
            throw new Error("response_type");
        }
        if (!scope) {
            Logger.error(me, "ctor: No scope passed");
            throw new Error("scope");
        }
        if (!authority) {
            Logger.error(me, "ctor: No authority passed");
            throw new Error("authority");
        }

        me.state = Ext.create('oidc.state.signin', {
            data: stateData,
            requestType,
            codeVerifier: !me.disablePKCE,
            clientId,
            authority,
            redirectUri,
            responseMode,
            clientSecret,
            scope,
            extraTokenParams,
            skipUserInfo
        });

        let parsedUrl = new URL(url);
        parsedUrl.searchParams.append("client_id", clientId);
        parsedUrl.searchParams.append("redirect_uri", redirectUri);
        parsedUrl.searchParams.append("response_type", responseType);
        parsedUrl.searchParams.append("scope", scope);
        if (nonce) {
            parsedUrl.searchParams.append("nonce", nonce);
        }

        parsedUrl.searchParams.append("state", me.state.id);
        if (me.state.codeChallenge) {
            parsedUrl.searchParams.append("code_challenge", me.state.codeChallenge);
            parsedUrl.searchParams.append("code_challenge_method", "S256");
        }

        if (resource) {
            // https://datatracker.ietf.org/doc/html/rfc8707
            let resources = Array.isArray(resource) ? resource : [resource];
            resources
                .forEach(r => parsedUrl.searchParams.append("resource", r));
        }

        for (let [key, value] of Object.entries({ responseMode, ...optionalParams, ...extraQueryParams })) {
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
