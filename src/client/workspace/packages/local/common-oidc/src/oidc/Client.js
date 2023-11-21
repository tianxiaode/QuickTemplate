/**
 * Provides the raw OIDC/OAuth2 protocol support for the authorization endpoint and the end session endpoint in the
 * authorization server. It provides a bare-bones protocol implementation and is used by the UserManager class.
 * Only use this class if you simply want protocol support without the additional management features of the
 * UserManager class.
 *
 * @public
 */

Ext.define('Common.oidc.Client', {
    alias: 'oidc.client',

    settings: null,

    metadataServicenull,
    claimsService: null,
    validator: null,
    tokenClient: null,

    constructor(clientSettings, metadataService) {
        let me = this,
            settings;
        settings = me.settings = clientSettings.isInstance ? clientSettings : Ext.create('oidc.setting.client', clientSettings);
        me.metadataService = metadataService ?? Ext.create('oidc.service.metadata', settings);
        me.claimsService = Ext.create('oidc.service.claim', settings);
        me.validator = Ext.create('oidc.response.validator', settings, me.metadataService, me.claimsService);
        me.tokenClient = Ext.create('oidc.tokenclient', settings, metadataService);
    },

    async createSigninRequest({
        state,
        request,
        requestUri,
        requestType,
        idTokenHint,
        loginHint,
        skipUserInfo,
        nonce,
        responseType,
        scope,
        redirectUri,
        prompt,
        display,
        maxAge,
        uiLocales,
        acrValues,
        resource,
        responseMode,
        extraQueryParams,
        extraTokenParams
    }){
        let me = this,
            settings = me.settings;
        responseType = responseType || settings.responseType;
        scope = scope || settings.scope;
        redirectUri = redirectUri || settings.redirectUri;
        prompt = prompt || settings.prompt;
        display = display || settings.display;
        maxAge = maxAge || settings.maxAge;
        uiLocales = uiLocales || settings.uiLocales;
        acrValues = acrValues || settings.acrValues;
        resource = resource || settings.resource;
        responseMode = responseMode || settings.responseMode;
        extraQueryParams = extraQueryParams || settings.extraQueryParams;
        extraTokenParams = extraTokenParams || settings.extraTokenParams;

        if (responseType !== "code") {
            throw new Error("Only the Authorization Code flow (with PKCE) is supported");
        }

        let url = await me.metadataService.getAuthorizationEndpoint();
        Logger.debug(me, "Received authorization endpoint", url);

        let signinRequest = Ext.create('oidc.request.Signin', {
            url,
            authority: settings.authority,
            clientId: settings.clientId,
            redirectUri,
            responseType,
            scope,
            stateData: state,
            prompt, display, maxAge, uiLocales, idTokenHint, loginHint, acrValues,
            resource, request, requestUri, extraQueryParams, extraTokenParams, requestType, responseMode,
            clientSecret: settings.clientSecret,
            skipUserInfo,
            nonce,
            disablePKCE: settings.disablePKCE,
        });

        // house cleaning
        await me.clearStaleState();

        let signinState = signinRequest.state;
        await AppStorage.set(signinState.id, signinState.toStorageString());
        return signinRequest;

    },

    async readSigninResponseState(url, removeState){
        let me = this,
            settings = me.settings,
            response = Ext.create('oidc.response.signin', URI.readParams(url, settings.responseMode));
        if (!response.state) {
            Logger.throw(me , new Error("No state in response"));
        }

        let storedStateString = await me.settings.stateStore[removeState ? "remove" : "get"](response.state);

        if (!storedStateString) {
            Logger.throw(me, new Error("No matching state found in storage"));
        }

        const state = Common.oidc.state.Signin.fromStorageString(storedStateString);
        return { state, response };
    },

    async processSigninResponse(url){
        let me = this;

        const { state, response } = await me.readSigninResponseState(url, true);
        Logger.debug(me , "received state from storage; validating response");
        await me.validator.validateSigninResponse(response, state);
        return response;
    },

    async processResourceOwnerPasswordCredentials({
        password,
        skipUserInfo = false,
        extraTokenParams = {},
        }){
        let me = this,
            tokenResponse = await me.tokenClient.exchangeCredentials({ username, password, ...extraTokenParams });
        const signinResponse = Ext.create('oidc.response.signin', new URLSearchParams());
        Object.assign(signinResponse, tokenResponse);
        await me.validator.validateCredentialsResponse(signinResponse, skipUserInfo);
        return signinResponse;
    },

    async useRefreshToken({
        state,
        timeoutInSeconds,
    }){
        let me  = this,
            settings = me.settings;
        // https://github.com/authts/oidc-client-ts/issues/695
        // In some cases (e.g. AzureAD), not all granted scopes are allowed on token refresh requests.
        // Therefore, we filter all granted scopes by a list of allowable scopes.
        let scope;
        if (settings.refreshTokenAllowedScope === undefined) {
            scope = state.scope;
        } else {
            let allowableScopes = settings.refreshTokenAllowedScope.split(" ");
            let providedScopes = state.scope?.split(" ") || [];

            scope = providedScopes.filter(s => allowableScopes.includes(s)).join(" ");
        }

        let result = await me.tokenClient.exchangeRefreshToken({
            refreshToken: state.refreshToken,
            resource: state.resource,
            // provide the (possible filtered) scope list
            scope,
            timeoutInSeconds,
        });
        const response = Ext.create('oidc.response.signin', new URLSearchParams());
        Object.assign(response, result);
        Logger.debug(me, "validating response", response);
        await me.validator.validateRefreshResponse(response, {
            ...state,
            // overide the scope in the state handed over to the validator
            // so it can set the granted scope to the requested scope in case none is included in the response
            scope,
        });
        return response;
    },

    async createSignoutRequest({
        state,
        idTokenHint,
        clientId,
        requestType,
        postLogoutRedirectUri,
        extraQueryParams
    }){
        let me = this,
            settings = me.settings,
            url = await me.metadataService.getEndSessionEndpoint();
        postLogoutRedirectUri = postLogoutRedirectUri || settings.postLogoutRedirectUri;
        extraQueryParams = extraQueryParams || settings.extraQueryParams
        if (!url) {
            throw new Error("No end session endpoint");
        }

        Logger.debug(me, "Received end session endpoint", url);

        // specify the client identifier when post_logout_redirect_uri is used but id_token_hint is not
        if (!clientId && postLogoutRedirectUri && !idTokenHint) {
            clientId = settings.clientId;
        }

        let request = Ext.create('oidc.request.signin', {
            url,
            idTokenHint,
            clientId,
            postLogoutRedirectUri,
            stateData: state,
            extraQueryParams,
            requestType,
        });

        // house cleaning
        await me.clearStaleState();

        let signoutState = request.state;
        if (signoutState) {
            Logger.debug(me, "Signout request has state to persist");
            await settings.stateStore.set(signoutState.id, signoutState.toStorageString());
        }

        return request;
    },

    async readSignoutResponseState(url, removeState) {
        let me = this,
            settings = me.settings,
            response = Ext.create('oidc.request.signout', URI.readParams(url, settings.responseMode));
        if (!response.state) {
            Logger.debug(me, "No state in response");

            if (response.error) {
                Logger.warn(me, "Response was error:", response.error);
                throw new Error(response.error);
            }

            return { state, response };
        }

        let storedStateString = await settings.stateStore[removeState ? "remove" : "get"](response.state);
        if (!storedStateString) {
            throw new Error("No matching state found in storage");
        }

        let state = State.fromStorageString(storedStateString);
        return { state, response };
    },

    async processSignoutResponse(url){

        let me =this,
             { state, response } = await me.readSignoutResponseState(url, true);
        if (state) {
            Logger.debug(me, "Received state from storage; validating response");
            me.validator.validateSignoutResponse(response, state);
        } else {
            Logger.debug(me, "No state from storage; skipping response validation");
        }

        return response;
    },

    clearStaleState(){
        return Common.oidc.state.State.clearStaleState(this.settings.stateStore, this.settings.staleStateAgeInSeconds);
    },

    async revokeToken(token, type){
        return await this.tokenClient.revoke({
            token,
            tokenTypeHint: type,
        });
    },

    destroy() {
        this.destroyMembers('settings', 'metadataService', 'claimsService', 'validator', 'tokenClient');
        this.callParent();
    }

})
