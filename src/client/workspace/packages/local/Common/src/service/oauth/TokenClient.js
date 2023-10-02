Ext.define('Common.sevices.oauth.TokenClient',{
    alternateClassName: 'tokenclient',

    constructor(config) {
        Ext.apply(this, config);
    },

    async exchangeCode(...args){
        let me = this,
            settings = me.settings,
            grantType = "authorization_code",
            redirectUri = settings.redirectUri,
            clientId = settings.clientId,
            clientSecret = settings.clientSecret,
        if (!clientId) {
            Ext.raise("A client_id is required");
        }
        if (!redirectUri) {
            Ext.raise("A redirect_uri is required");
        }
        if (!args.code) {
            Ext.raise("A code is required");
        }

        let params = { grant_type, redirect_uri };
        for (let [key, value] of Object.entries(args)) {
            if (value != null) {
                params[key] = value;
            }
        }
        let basicAuth = undefined;
        switch (settings.clientAuthentication) {
            case "client_secret_basic":
                if (!clientSecret) {
                    Ext.raise("A client_secret is required");
                    throw null; // https://github.com/microsoft/TypeScript/issues/46972
                }
                basicAuth = CryptoUtils.generateBasicAuth(client_id, client_secret);
                break;
            case "client_secret_post":
                params.append("client_id", client_id);
                if (client_secret) {
                    params.append("client_secret", client_secret);
                }
                break;
        }

        const url = await this._metadataService.getTokenEndpoint(false);
        logger.debug("got token endpoint");

        const response = await this._jsonService.postForm(url, { body: params, basicAuth, initCredentials: this._settings.fetchRequestCredentials });
        logger.debug("got response");

        return response;
    }

    /**
     * Exchange credentials.
     *
     * @see https://www.rfc-editor.org/rfc/rfc6749#section-4.3.2
     */
    public async exchangeCredentials({
        grant_type = "password",
        client_id = this._settings.client_id,
        client_secret = this._settings.client_secret,
        scope = this._settings.scope,
        ...args
    }: ExchangeCredentialsArgs): Promise<Record<string, unknown>> {
        const logger = this._logger.create("exchangeCredentials");

        if (!client_id) {
            logger.throw(new Error("A client_id is required"));
        }

        const params = new URLSearchParams({ grant_type, scope });
        for (const [key, value] of Object.entries(args)) {
            if (value != null) {
                params.set(key, value);
            }
        }

        let basicAuth: string | undefined;
        switch (this._settings.client_authentication) {
            case "client_secret_basic":
                if (!client_secret) {
                    logger.throw(new Error("A client_secret is required"));
                    throw null; // https://github.com/microsoft/TypeScript/issues/46972
                }
                basicAuth = CryptoUtils.generateBasicAuth(client_id, client_secret);
                break;
            case "client_secret_post":
                params.append("client_id", client_id);
                if (client_secret) {
                    params.append("client_secret", client_secret);
                }
                break;
        }

        const url = await this._metadataService.getTokenEndpoint(false);
        logger.debug("got token endpoint");

        const response = await this._jsonService.postForm(url, { body: params, basicAuth, initCredentials: this._settings.fetchRequestCredentials });
        logger.debug("got response");

        return response;
    }

    /**
     * Exchange a refresh token.
     *
     * @see https://www.rfc-editor.org/rfc/rfc6749#section-6
     */
    public async exchangeRefreshToken({
        grant_type = "refresh_token",
        client_id = this._settings.client_id,
        client_secret = this._settings.client_secret,
        timeoutInSeconds,
        ...args
    }: ExchangeRefreshTokenArgs): Promise<Record<string, unknown>> {
        const logger = this._logger.create("exchangeRefreshToken");
        if (!client_id) {
            logger.throw(new Error("A client_id is required"));
        }
        if (!args.refresh_token) {
            logger.throw(new Error("A refresh_token is required"));
        }

        const params = new URLSearchParams({ grant_type });
        for (const [key, value] of Object.entries(args)) {
            if (Array.isArray(value)) {
                value.forEach(param => params.append(key, param));
            }
            else if (value != null) {
                params.set(key, value);
            }
        }
        let basicAuth: string | undefined;
        switch (this._settings.client_authentication) {
            case "client_secret_basic":
                if (!client_secret) {
                    logger.throw(new Error("A client_secret is required"));
                    throw null; // https://github.com/microsoft/TypeScript/issues/46972
                }
                basicAuth = CryptoUtils.generateBasicAuth(client_id, client_secret);
                break;
            case "client_secret_post":
                params.append("client_id", client_id);
                if (client_secret) {
                    params.append("client_secret", client_secret);
                }
                break;
        }

        const url = await this._metadataService.getTokenEndpoint(false);
        logger.debug("got token endpoint");

        const response = await this._jsonService.postForm(url, { body: params, basicAuth, timeoutInSeconds, initCredentials: this._settings.fetchRequestCredentials });
        logger.debug("got response");

        return response;
    }

    /**
     * Revoke an access or refresh token.
     *
     * @see https://datatracker.ietf.org/doc/html/rfc7009#section-2.1
     */
    public async revoke(args: RevokeArgs): Promise<void> {
        const logger = this._logger.create("revoke");
        if (!args.token) {
            logger.throw(new Error("A token is required"));
        }

        const url = await this._metadataService.getRevocationEndpoint(false);

        logger.debug(`got revocation endpoint, revoking ${args.token_type_hint ?? "default token type"}`);

        const params = new URLSearchParams();
        for (const [key, value] of Object.entries(args)) {
            if (value != null) {
                params.set(key, value);
            }
        }
        params.set("client_id", this._settings.client_id);
        if (this._settings.client_secret) {
            params.set("client_secret", this._settings.client_secret);
        }

        await this._jsonService.postForm(url, { body: params });
        logger.debug("got response");
    }


    destroy() {
        this.destroyMembers('settings', 'metadataService');
        this.callParent();
    }

})
