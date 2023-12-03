Ext.define('Common.oidc.TokenClient', {
    alias: 'oidc.tokenclient',

    requires: [
        'Common.oidc.util.Crypto',
        'Common.oidc.service.Json',
        'Common.oidc.service.Metadata',
        'Common.oidc.setting.Client'
    ],

    jsonService: null,

    grantType: 'authorization_code',
    redirectUri: null,
    clientId: null,
    clientSecret: null,
    clientAuthentication: null,

    constructor(clientSettings, metadataService) {
        let me = this,
            settings;
        settings = me.settings = clientSettings.isInstance ? clientSettings : Ext.create('oidc.setting.client', clientSettings);
        me.metadataService = metadataService;
        me.jsonService = Ext.create('oidc.service.json', settings.additionalContentTypes, null, settings.extraHeaders);

    },

    async exchangeCode(options) {
        let me = this,
            { grantType, redirectUri, clientId, clientSecret, ...args } = options,
            settings = me.settings;
        grantType = grantType || me.grantType;
        redirectUri = redirectUri || settings.redirectUri;
        clientId = clientId || settings.clientId;
        clientSecret = clientSecret || settings.clientSecret;
        if (!clientId) {
            throw new Error("A client_id is required");
        }
        if (!redirectUri) {
            throw new Error("A redirect_uri is required");
        }
        if (!options.code) {
            throw new Error("A code is required");
        }

        let params = new URLSearchParams({ grant_type: grantType, redirect_uri: redirectUri });
        for (let [key, value] of Object.entries(args)) {
            if (value != null) {
                params.set(Format.splitCamelCase(key, '_'), value);
            }
        }
        let basicAuth;
        switch (settings.clientAuthentication) {
            case "client_secret_basic":
                if (!clientSecret) {
                    throw new Error("A client_secret is required");
                }
                basicAuth = Oidc.Crypto.generateBasicAuth(clientId, clientSecret);
                break;
            case "client_secret_post":
                params.append("client_id", clientId);
                if (clientSecret) {
                    params.append("client_secret", clientSecret);
                }
                break;
        }

        let url = await me.metadataService.getTokenEndpoint(false);
        Logger.debug(me.exchangeCode, "got token endpoint");

        let response = await me.jsonService.postForm(url, params.toString(), basicAuth, settings.fetchRequestCredentials);
        Logger.debug(me.exchangeCode, "got response");

        return response;

    },

    async exchangeCredentials(options) {
        let me = this,
            { grantType, clientId, clientSecret, scope, ...args } = options,
            settings = me.settings;
        grantType = grantType || 'password';
        clientId = clientId || settings.clientId;
        clientSecret = clientSecret || settings.clientSecret;
        scope = scope || settings.scope;

        if (!clientId) {
            throw new Error("A client_id is required");
        }

        let params = new URLSearchParams({ grant_type: grantType, scope });
        for (let [key, value] of Object.entries(args)) {
            if (value != null) {
                params.set(Format.splitCamelCase(key, '_'), value);
            }
        }

        let basicAuth;
        switch (settings.clientAuthentication) {
            case "client_secret_basic":
                if (!clientSecret) {
                    throw new Error("A client_secret is required");
                }
                basicAuth = Oidc.Crypto.generateBasicAuth(clientId, clientSecret);
                break;
            case "client_secret_post":
                params.append("client_id", clientId);
                if (clientSecret) {
                    params.append("client_secret", clientSecret);
                }
                break;
        }

        let url = await me.metadataService.getTokenEndpoint(false);
        Logger.debug(me.exchangeCredentials, "got token endpoint");

        let response = await me.jsonService.postForm(url, params, basicAuth, settings.fetchRequestCredentials);
        Logger.debug(me.exchangeCredentials, "got response");

        return response;
    },

    /**
 * Exchange a refresh token.
 *
 * @see https://www.rfc-editor.org/rfc/rfc6749#section-6
 */
    async exchangeRefreshToken(options) {

        let me = this,
            { granttType, clientId, clientSecret, ...args } = options,
            settings = me.settings;
        grantType = grantType || 'refresh_token';
        clientId = clientId || settings.clientId;
        clientSecret = clientSecret || settings.clientSecret;

        if (!clientId) {
            throw new Error("A client_id is required");
        }
        if (!args.refreshToken) {
            throw new Error("A refresh_token is required");
        }

        let params = new URLSearchParams({ grant_type: granttType });
        for (let [key, value] of Object.entries(args)) {
            if (Array.isArray(value)) {
                value.forEach(param => params.append(Format.splitCamelCase(key, '_'), param));
            }
            else if (value != null) {
                params.set(Format.splitCamelCase(key, '_'), value);
            }
        }
        let basicAuth;
        switch (settings.clientAuthentication) {
            case "client_secret_basic":
                if (!clientSecret) {
                    throw new Error("A client_secret is required");
                }
                basicAuth = Oidc.Crypto.generateBasicAuth(clientId, clientSecret);
                break;
            case "client_secret_post":
                params.append("client_id", clientId);
                if (clientSecret) {
                    params.append("client_secret", clientSecret);
                }
                break;
        }

        let url = await me.metadataService.getTokenEndpoint(false);
        Logger.debug(me.exchangeRefreshToken, "got token endpoint");

        let response = await me.jsonService.postForm(url, params, basicAuth, settings.fetchRequestCredentials);
        Logger.debug(me.exchangeRefreshToken, "got response");

        return response;
    },

    /**
 * Revoke an access or refresh token.
 *
 * @see https://datatracker.ietf.org/doc/html/rfc7009#section-2.1
 */
    async revoke(args) {
        let me = this,
            settings = me.settings;

        if (!args.token) {
            throw new Error("A token is required");
        }

        let url = await me.metadataService.getRevocationEndpoint(false);

        Logger.debug(me.revoke, `got revocation endpoint, revoking ${args.tokenTypeHint || "default token type"}`);

        let params = new URLSearchParams();
        for (let [key, value] of Object.entries(args)) {
            if (value != null) {
                params.set(Format.splitCamelCase(key, '_'), value);
            }
        }
        params.set("client_id", settings.clientId);
        if (settings.clientSecret) {
            params.set("client_secret", settings.clientSecret);
        }

        await me.jsonService.postForm(url, params);
        Logger.debug(me.revoke, "got response");
    },


    destroy() {
        this.destroyMembers('jsonService', 'settings', 'metadataService');
        this.callParent();
    }

});
