Ext.define('Common.oidc.request.Signin', {
    alias: 'oidc.request.signin',

    requires: [
        'Common.oidc.state.Signin',
        'Common.oidc.util.Url',
    ],

    /**
    * @public
    * @see https://openid.net/specs/openid-connect-core-1_0.html#AuthRequest
    */

    // // mandatory
    // url: null,
    // authority: null,
    // clientId: null,
    // redirectUri: null,
    // responseType: null,
    // scope: null,

    // // optional
    // responseMode: null,
    // nonce: null,
    // display: null,
    // prompt: null,
    // maxAge: 0,
    // uiLocales: null,
    // idTokenHint: null,
    // loginHint: null,
    // acrValues: null,

    // // other
    // resource: null,
    // request: null,
    // requestUri: null,
    // requestType: null,
    // extraQueryParams: null,

    // // special
    // extraTokenParams: null,
    // clientSecret: null,
    // skipUserInfo: false,
    // disablePKCE: false,
    // /** custom "state", which can be used by a caller to have "data" round tripped */
    // stateData: null,

    statics: {
        async create(settings) {
            let me = this;
            let {
                // mandatory
                url, authority, clientId, redirectUri, responseType, scope,
                // optional
                stateData, responseMode, requestType, clientSecret, nonce,urlState,
                resource,
                skipUserInfo,
                extraQueryParams,
                extraTokenParams,
                disablePKCE,
                ...optionalParams
            } = settings;

            if (!url) {
                Logger.error(me.create, "ctor: No url passed");
                throw new Error("url");
            }
            if (!clientId) {
                Logger.error(me.create, "ctor: No client_id passed");
                throw new Error("client_id");
            }
            if (!redirectUri) {
                Logger.error(me.create, "ctor: No redirect_uri passed");
                throw new Error("redirect_uri");
            }
            if (!responseType) {
                Logger.error(me.create, "ctor: No response_type passed");
                throw new Error("response_type");
            }
            if (!scope) {
                Logger.error(me.create, "ctor: No scope passed");
                throw new Error("scope");
            }
            if (!authority) {
                Logger.error(me.create, "ctor: No authority passed");
                throw new Error("authority");
            }

            let state = await Common.oidc.state.Signin.create({
                data: stateData,
                requestType,
                urlState,
                codeVerifier: !disablePKCE,
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

            let stateParam = state.id;
            if (urlState) {
                stateParam = `${stateParam}${Oidc.Url.URL_STATE_DELIMITER}${urlState}`;
            }

            parsedUrl.searchParams.append("state", stateParam);
            if (state.codeChallenge) {
                parsedUrl.searchParams.append("code_challenge", state.codeChallenge);
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
                    let name = extraQueryParams && extraQueryParams.hasOwnProperty(key) ? key : Format.splitCamelCase(key, '_');
                    parsedUrl.searchParams.append(name, value.toString());
                }
            }

            return Ext.create('oidc.request.signin', parsedUrl.href, state);

        }
    },

    constructor(url, state) {
        let me = this;
        me.url = url;
        me.state = state;
    },

    destroy() {
        this.destroyMembers('state');
        this.callParent();
    }

})
