Ext.define('Common.service.oauth.OidcClient', {

    requires: [
        'Common.service.Url',
        'Common.service.HttpClient',
        'Common.service.oauth.OidcClientSettingsStore',
        'Common.service.oauth.Metadata',
        'Common.sevices.oauth.Claims',
    ],

    settings: undefined,

    metadataService: undefined,
    claimsService: undefined,
    validator: undefined,
    tokenClient: null,

    
    constructor(config) {
        let me = this;
        me.settings = Ext.create('Common.service.oauth.OidcClientSettingsStore', config.settings);

        me.metadataService = Ext.create('Common.service.oauth.Metadata', me.settings);
        me.claimsService = Ext.create('Common.service.oauth.Claims', me.settings);
        me.validator = new ResponseValidator(this.settings, this.metadataService, this._claimsService);
        me.tokenClient = new TokenClient(this.settings, this.metadataService);
    }

    async createSigninRequest({
        state,
        request,
        request_uri,
        request_type,
        id_token_hint,
        login_hint,
        skipUserInfo,
        nonce,
        response_type = this.settings.response_type,
        scope = this.settings.scope,
        redirect_uri = this.settings.redirect_uri,
        prompt = this.settings.prompt,
        display = this.settings.display,
        max_age = this.settings.max_age,
        ui_locales = this.settings.ui_locales,
        acr_values = this.settings.acr_values,
        resource = this.settings.resource,
        response_mode = this.settings.response_mode,
        extraQueryParams = this.settings.extraQueryParams,
        extraTokenParams = this.settings.extraTokenParams,
    }{

        if (response_type !== "code") {
            throw new Error("Only the Authorization Code flow (with PKCE) is supported");
        }

        const url = await this.metadataService.getAuthorizationEndpoint();
        logger.debug("Received authorization endpoint", url);

        const signinRequest = new SigninRequest({
            url,
            authority: this.settings.authority,
            client_id: this.settings.client_id,
            redirect_uri,
            response_type,
            scope,
            state_data: state,
            prompt, display, max_age, ui_locales, id_token_hint, login_hint, acr_values,
            resource, request, request_uri, extraQueryParams, extraTokenParams, request_type, response_mode,
            client_secret: this.settings.client_secret,
            skipUserInfo,
            nonce,
            disablePKCE: this.settings.disablePKCE,
        });

        // house cleaning
        await this.clearStaleState();

        const signinState = signinRequest.state;
        await this.settings.stateStore.set(signinState.id, signinState.toStorageString());
        return signinRequest;
    }

    public async readSigninResponseState(url: string, removeState = false): Promise<{ state: SigninState; response: SigninResponse }> {
        const logger = this._logger.create("readSigninResponseState");

        const response = new SigninResponse(UrlUtils.readParams(url, this.settings.response_mode));
        if (!response.state) {
            logger.throw(new Error("No state in response"));
            // need to throw within this function's body for type narrowing to work
            throw null; // https://github.com/microsoft/TypeScript/issues/46972
        }

        const storedStateString = await this.settings.stateStore[removeState ? "remove" : "get"](response.state);
        if (!storedStateString) {
            logger.throw(new Error("No matching state found in storage"));
            throw null; // https://github.com/microsoft/TypeScript/issues/46972
        }

        const state = SigninState.fromStorageString(storedStateString);
        return { state, response };
    }

    public async processSigninResponse(url: string): Promise<SigninResponse> {
        const logger = this._logger.create("processSigninResponse");

        const { state, response } = await this.readSigninResponseState(url, true);
        logger.debug("received state from storage; validating response");
        await this._validator.validateSigninResponse(response, state);
        return response;
    }

    public async processResourceOwnerPasswordCredentials({
        username,
        password,
        skipUserInfo = false,
        extraTokenParams = {},
    }: ProcessResourceOwnerPasswordCredentialsArgs): Promise<SigninResponse> {
        const tokenResponse: Record<string, unknown> = await this._tokenClient.exchangeCredentials({ username, password, ...extraTokenParams });
        const signinResponse: SigninResponse = new SigninResponse(new URLSearchParams());
        Object.assign(signinResponse, tokenResponse);
        await this._validator.validateCredentialsResponse(signinResponse, skipUserInfo);
        return signinResponse;
    }

    public async useRefreshToken({
        state,
        timeoutInSeconds,
    }: UseRefreshTokenArgs): Promise<SigninResponse> {
        const logger = this._logger.create("useRefreshToken");

        // https://github.com/authts/oidc-client-ts/issues/695
        // In some cases (e.g. AzureAD), not all granted scopes are allowed on token refresh requests.
        // Therefore, we filter all granted scopes by a list of allowable scopes.
        let scope;
        if (this.settings.refreshTokenAllowedScope === undefined) {
            scope = state.scope;
        } else {
            const allowableScopes = this.settings.refreshTokenAllowedScope.split(" ");
            const providedScopes = state.scope?.split(" ") || [];

            scope = providedScopes.filter(s => allowableScopes.includes(s)).join(" ");
        }

        const result = await this._tokenClient.exchangeRefreshToken({
            refresh_token: state.refresh_token,
            resource: state.resource,
            // provide the (possible filtered) scope list
            scope,
            timeoutInSeconds,
        });
        const response = new SigninResponse(new URLSearchParams());
        Object.assign(response, result);
        logger.debug("validating response", response);
        await this._validator.validateRefreshResponse(response, {
            ...state,
            // overide the scope in the state handed over to the validator
            // so it can set the granted scope to the requested scope in case none is included in the response
            scope,
        });
        return response;
    }

    public async createSignoutRequest({
        state,
        id_token_hint,
        client_id,
        request_type,
        post_logout_redirect_uri = this.settings.post_logout_redirect_uri,
        extraQueryParams = this.settings.extraQueryParams,
    }: CreateSignoutRequestArgs = {}): Promise<SignoutRequest> {
        const logger = this._logger.create("createSignoutRequest");

        const url = await this.metadataService.getEndSessionEndpoint();
        if (!url) {
            logger.throw(new Error("No end session endpoint"));
            throw null; // https://github.com/microsoft/TypeScript/issues/46972
        }

        logger.debug("Received end session endpoint", url);

        // specify the client identifier when post_logout_redirect_uri is used but id_token_hint is not
        if (!client_id && post_logout_redirect_uri && !id_token_hint) {
            client_id = this.settings.client_id;
        }

        const request = new SignoutRequest({
            url,
            id_token_hint,
            client_id,
            post_logout_redirect_uri,
            state_data: state,
            extraQueryParams,
            request_type,
        });

        // house cleaning
        await this.clearStaleState();

        const signoutState = request.state;
        if (signoutState) {
            logger.debug("Signout request has state to persist");
            await this.settings.stateStore.set(signoutState.id, signoutState.toStorageString());
        }

        return request;
    }

    public async readSignoutResponseState(url: string, removeState = false): Promise<{ state: State | undefined; response: SignoutResponse }> {
        const logger = this._logger.create("readSignoutResponseState");

        const response = new SignoutResponse(UrlUtils.readParams(url, this.settings.response_mode));
        if (!response.state) {
            logger.debug("No state in response");

            if (response.error) {
                logger.warn("Response was error:", response.error);
                throw new ErrorResponse(response);
            }

            return { state: undefined, response };
        }

        const storedStateString = await this.settings.stateStore[removeState ? "remove" : "get"](response.state);
        if (!storedStateString) {
            logger.throw(new Error("No matching state found in storage"));
            throw null; // https://github.com/microsoft/TypeScript/issues/46972
        }

        const state = State.fromStorageString(storedStateString);
        return { state, response };
    }

    public async processSignoutResponse(url: string): Promise<SignoutResponse> {
        const logger = this._logger.create("processSignoutResponse");

        const { state, response } = await this.readSignoutResponseState(url, true);
        if (state) {
            logger.debug("Received state from storage; validating response");
            this._validator.validateSignoutResponse(response, state);
        } else {
            logger.debug("No state from storage; skipping response validation");
        }

        return response;
    }

    clearStaleState(): Promise<void> {
        this._logger.create("clearStaleState");
        return State.clearStaleState(this.settings.stateStore, this.settings.staleStateAgeInSeconds);
    }

    async revokeToken(token: string, type?: "access_token" | "refresh_token"): Promise<void> {
        this._logger.create("revokeToken");
        return await this._tokenClient.revoke({
            token,
            token_type_hint: type,
        });
    }

})
