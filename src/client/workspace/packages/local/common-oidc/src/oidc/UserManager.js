/**
 * Provides a higher level API for signing a user in, signing out, managing the user's claims returned from the identity provider,
 * and managing an access token returned from the identity provider (OAuth2/OIDC).
 *
 * @public
 */
Ext.define('Common.oidc.UserManager', {
    alias: 'oidc.usermanager',

    requires: [
        'Common.oidc.navigator.Redirect',
        'Common.oidc.navigator.Popup',
        'Common.oidc.navigator.IFrame',
        'Common.oidc.event.UserManager',
        'Common.oidc.service.SilentRenew',
        'Common.oidc.SessionMonitor',
        'Common.oidc.state.Refresh',
        'Common.oidc.User',
    ],

    client: null,
    redirectNavigator: null,
    popupNavigator: null,
    iframeNavigator: null,
    events: null,
    silentRenewService: null,
    sessionMonitor: null,

    constructor(userManagerSettings, redirectNavigator, popupNavigator, iframeNavigator) {
        let me = this,
            settings;
        settings = me.settings = userManagerSettings.isInstance ? userManagerSettings : Ext.create('oidc.setting.usermanager', userManagerSettings);
        //me.client = Ext.create('oidc.client', settings);
        me.redirectNavigator = redirectNavigator;
        me.popupNavigator = popupNavigator ;
        me.iframeNavigator = iframeNavigator;;
        me.events = Ext.create('oidc.event.usermanager', settings);
        me.silentRenewService = Ext.create('oidc.service.silentrenew', me);

        if (settings.automaticSilentRenew) {
            Ext.on('documentVisibilityChange', me.onDocumentVisibilityChange.bind(me));
            me.startSilentRenew();
        }

        me.sessionMonitor = null;
        if (settings.monitorSession) {
            me.sessionMonitor = Ext.create('oidc.sessionmonitor', me);
        }

    },

    getClient(){
        let me = this,
            client = me.client;
        if(client) return client;
        client = me.client = Ext.create('oidc.client', me.settings);
        return client;        
    },

    getRedirectNavigator(){
        let me = this,
            navigator = me.redirectNavigator;
        if(navigator) return navigator;
        navigator = me.redirectNavigator = Ext.create('oidc.navigator.redirect', me.settings);
        return navigator;
    },

    getPopupNavigator(){
        let me = this,
            navigator = me.popupNavigator;
        if(navigator) return navigator;
        navigator = me.popupNavigator = Ext.create('oidc.navigator.popup', me.settings);
        return navigator;
    },

    getIframeNavigator(){
        let me = this,
            navigator = me.iframeNavigator;
        if(navigator) return navigator;
        navigator = me.iframeNavigator = Ext.create('oidc.navigator.iframe', me.settings);
        return navigator;
    },

    /**
     * Get object used to register for events raised by the `UserManager`.
     */
    getEvents() {
        return this.events;
    },

    /**
     * Get object used to access the metadata configuration of the identity provider.
     */
    getMmetadataService() {
        return this.getClient().metadataService;
    },

    /**
     * Load the `User` object for the currently authenticated user.
     *
     * @returns A promise
     */
    async getUser() {
        let me = this;
        Logger.debug(me.getUser, "getUser");
        let user = await me.loadUser();
        if (user) {
            Logger.info(me.getUser, "user loaded");
            me.events.load(user, false);
            return user;
        }

        Logger.info(me.getUser, "user not found in storage");
        return null;
    },

    /**
     * Remove from any storage the currently authenticated user.
     *
     * @returns A promise
     */
    async removeUser() {
        let me = this;
        Logger.debug(me.removeUser, "removeUser");
        await me.storeUser(null);
        Logger.info(me.removeUser, "user removed from storage");
        me.events.unload();
    },

    /**
     * Trigger a redirect of the current window to the authorization endpoint.
     *
     * @returns A promise
     *
     * @throws `Error` In cases of wrong authentication.
     */
    async signinRedirect(args) {
        let me = this;
        Logger.debug(me.signinRedirect, "signinRedirect");
        args = args || {};
        let {
            redirectMethod,
            ...requestArgs
        } = args;
        let handle = await me.getRedirectNavigator().prepare({ redirectMethod });
        await me.signinStart({
            requestType: "si:r",
            ...requestArgs,
        }, handle);
    },

    /**
     * Process the response (callback) from the authorization endpoint.
     * It is recommend to use {@link UserManager.signinCallback} instead.
     *
     * @returns A promise containing the authenticated `User`.
     *
     * @see {@link UserManager.signinCallback}
     */
    async signinRedirectCallback(url) {
        let me = this;
        url = url || window.location.href;
        Logger.debug(me.signinRedirectCallback, "signinRedirectCallback", url);
        let user = await me.signinEnd(url);
        if (user.profile && user.profile.sub) {
            Logger.info(me.signinCallback, "success, signed in subject", user.profile.sub);
        }
        else {
            Logger.info(me.signinCallback, "no subject");
        }

        return user;
    },

    /**
     * Trigger the signin with user/password.
     *
     * @returns A promise containing the authenticated `User`.
     * @throws {@link ErrorResponse} In cases of wrong authentication.
     */
    async signinResourceOwnerCredentials(args) {
        let me = this,
            {
                username,
                password,
                skipUserInfo
            } = args;
        skipUserInfo = Ext.isEmpty(skipUserInfo) ? false : skipUserInfo;
        Logger.debug(me.signinResourceOwnerCredentials, "signinResourceOwnerCredentials");

        let signinResponse = await me.getClient().processResourceOwnerPasswordCredentials({ username, password, skipUserInfo, extraTokenParams: me.settings.extraTokenParams });
        Logger.debug(me.signinResourceOwnerCredentials, "got signin response");

        let user = await me.buildUser(signinResponse);
        if (user.profile && user.profile.sub) {
            Logger.info(me.signinResourceOwnerCredentials, "success, signed in subject", user.profile.sub);
        } else {
            Logger.info(me.signinResourceOwnerCredentials, "no subject");
        }
        return user;
    },

    /**
     * Trigger a request (via a popup window) to the authorization endpoint.
     *
     * @returns A promise containing the authenticated `User`.
     * @throws `Error` In cases of wrong authentication.
     */
    async signinPopup(args) {
        let me = this;
        Logger.debug(me.signinPopup, "signinPopup");

        let {
            popupWindowFeatures,
            popupWindowTarget,
            ...requestArgs
        } = args;
        let url = me.settings.popupRedirectUri;
        if (!url) {
            throw new Error("No popup_redirect_uri configured");
        }

        let handle = await me.getPopupNavigator().prepare({ popupWindowFeatures, popupWindowTarget });
        const user = await me.signin({
            requestType: "si:p",
            redirectUri: url,
            display: "popup",
            ...requestArgs,
        }, handle);
        if (user) {
            if (user.profile && user.profile.sub) {
                Logger.info(me.signinPopup, "success, signed in subject", user.profile.sub);
            }
            else {
                Logger.info(me.signinPopup, "no subject");
            }
        }

        return user;
    },

    /**
     * Notify the opening window of response (callback) from the authorization endpoint.
     * It is recommend to use {@link UserManager.signinCallback} instead.
     *
     * @returns A promise
     *
     * @see {@link UserManager.signinCallback}
     */
    async signinPopupCallback(url, keepOpen) {
        let me = this;
        Logger.debug(me.signinPopupCallback, "signinPopupCallback");
        url = url || window.location.href;
        await me.getPopupNavigator().callback(url, { keepOpen });
        Logger.info(me.signinPopupCallback, "success");
    },

    /**
     * Trigger a silent request (via refresh token or an iframe) to the authorization endpoint.
     *
     * @returns A promise that contains the authenticated `User`.
     */
    async signinSilent(args) {
        let me = this,
            settings = me.settings;
        Logger.debug(me.signinSilent, "signinSilent");
        args = args || {};
        let {
            silentRequestTimeoutInSeconds,
            resource,
            ...requestArgs
        } = args;

        // first determine if we have a refresh token, or need to use iframe
        let user = await me.loadUser();
        if (user && user.refreshToken) {
            Logger.debug(me.signinSilent, "using refresh token");
            let state = Ext.create('oidc.state.refresh', user, resource);
            return await me.useRefreshToken(state);
        }

        let url = settings.silentRedirectUri;
        if (!url) {
            throw new Error("No silent_redirect_uri configured");
        }

        let verifySub;
        if (user && settings.validateSubOnSilentRenew) {
            Logger.debug(me.signinSilent, "subject prior to silent renew:", user.profile.sub);
            verifySub = user.profile.sub;
        }

        let handle = await me.getIframeNavigator().prepare({ silentRequestTimeoutInSeconds });
        user = await me.signin({
            requestType: "si:s",
            redirectUri: url,
            prompt: "none",
            idTokenHint: settings.includeIdTokenInSilentRenew ? (user && user.idToken) : undefined,
            ...requestArgs,
        }, handle, verifySub);
        if (user) {
            if (user.profile && user.profile.sub) {
                Logger.info(me.signinSilent, "success, signed in subject", user.profile.sub);
            }
            else {
                Logger.info(me.signinSilent, "no subject");
            }
        }

        return user;
    },

    /**
     *
     * Notify the parent window of response (callback) from the authorization endpoint.
     * It is recommend to use {@link UserManager.signinCallback} instead.
     *
     * @returns A promise
     *
     * @see {@link UserManager.signinCallback}
     */
    async signinSilentCallback(url) {
        let me = this;
        Logger.debug(me.signinSilentCallback, "signinSilentCallback");
        url = url || window.location.href;
        await me.getIframeNavigator().callback(url);
        Logger.info(me.signinSilentCallback, "success");
    },

    /**
     * Process any response (callback) from the authorization endpoint, by dispatching the request_type
     * and executing one of the following functions:
     * - {@link UserManager.signinRedirectCallback}
     * - {@link UserManager.signinPopupCallback}
     * - {@link UserManager.signinSilentCallback}
     *
     * @throws `Error` If request_type is unknown or signout can not processed.
     */
    async signinCallback(url) {
        let me = this;
        url = url || window.location.href;
        let { state } = await me.getClient().readSigninResponseState(url);
        switch (state.requestType) {
            case "si:r":
                return await me.signinRedirectCallback(url);
            case "si:p":
                return await me.signinPopupCallback(url);
            case "si:s":
                return await me.signinSilentCallback(url);
            default:
                throw new Error("invalid response_type in state");
        }
    },

    /**
     * Process any response (callback) from the end session endpoint, by dispatching the request_type
     * and executing one of the following functions:
     * - {@link UserManager.signoutRedirectCallback}
     * - {@link UserManager.signoutPopupCallback}
     * - {@link UserManager.signoutSilentCallback}
     *
     * @throws `Error` If request_type is unknown or signout can not processed.
     */
    async signoutCallback(url, keepOpen) {
        let me = this;
        url = url || window.location.href;
        let { state } = await me.getClient().readSignoutResponseState(url);
        if (!state) {
            return;
        }

        switch (state.requestType) {
            case "so:r":
                await me.signoutRedirectCallback(url);
                break;
            case "so:p":
                await me.signoutPopupCallback(url, keepOpen);
                break;
            case "so:s":
                await me.signoutSilentCallback(url);
                break;
            default:
                throw new Error("invalid response_type in state");
        }
    },

    /**
     * Query OP for user's current signin status.
     *
     * @returns A promise object with session_state and subject identifier.
     */
    async querySessionStatus(args) {
        let me = this,
            settings = me.settings;
        Logger.debug(me.querySessionStatus, "querySessionStatus");
        const {
            silentRequestTimeoutInSeconds,
            ...requestArgs
        } = args;
        let url = settings.silentRedirectUri;
        if (!url) {
            throw new Error("No silent_redirect_uri configured");
        }

        let user = await me.loadUser();
        let handle = await me.getIframeNavigator().prepare({ silentRequestTimeoutInSeconds });
        let navResponse = await me.signinStart({
            requestType: "si:s", // this acts like a signin silent
            redirectUri: url,
            prompt: "none",
            idTokenHint: settings.includeIdTokenInSilentRenew ? (user && user.idToken) : undefined,
            responseType: settings.queryStatusResponseType,
            scope: "openid",
            skipUserInfo: true,
            ...requestArgs,
        }, handle);
        try {
            let signinResponse = await me.getClient().processSigninResponse(navResponse.url);
            Logger.debug(me.querySessionStatus, "got signin response");

            if (signinResponse.sessionState && signinResponse.profile.sub) {
                Logger.info(me.querySessionStatus, "success for subject", signinResponse.profile.sub);
                return {
                    sessionState: signinResponse.sessionState,
                    sub: signinResponse.profile.sub,
                };
            }

            Logger.info(me.querySessionStatus, "success, user not authenticated");
            return null;
        }
        catch (err) {
            if (me.settings.monitorAnonymousSession && err.error) {
                switch (err.error) {
                    case "login_required":
                    case "consent_required":
                    case "interaction_required":
                    case "account_selection_required":
                        logger.info("success for anonymous user");
                        return {
                            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                            sessionState: err.sessionState,
                        };
                }
            }
            throw err;
        }
    },

    /**
     * Trigger a redirect of the current window to the end session endpoint.
     *
     * @returns A promise
     */
    async signoutRedirect(args) {
        let me = this;
        Logger.debug(me.signoutRedirect, "signoutRedirect")
        let {
            redirectMethod,
            ...requestArgs
        } = args;
        let handle = await me.getRedirectNavigator().prepare({ redirectMethod });
        await me.signoutStart({
            requestType: "so:r",
            postLogoutRedirectUri: me.settings.postLogoutRedirectUri,
            ...requestArgs,
        }, handle);
        Logger.info(me.signoutRedirect, "success");
    },

    /**
     * Process response (callback) from the end session endpoint.
     * It is recommend to use {@link UserManager.signoutCallback} instead.
     *
     * @returns A promise containing signout response
     *
     * @see {@link UserManager.signoutCallback}
     */
    async signoutRedirectCallback(url) {
        let me = this;
        Logger.debug(me.signoutRedirectCallback, "signoutRedirectCallback");
        url = url || window.location.href;
        let response = await me.signoutEnd(url);
        Logger.info(me.signoutRedirectCallback, "success");
        return response;
    },

    /**
     * Trigger a redirect of a popup window window to the end session endpoint.
     *
     * @returns A promise
     */
    async signoutPopup(args) {
        let me = this;
        Logger.debug(me.signoutPopup, "signoutPopup");
        let {
            popupWindowFeatures,
            popupWindowTarget,
            ...requestArgs
        } = args;
        let url = me.settings.popupPostLogoutRedirectUri;

        let handle = await me.getPopupNavigator().prepare({ popupWindowFeatures, popupWindowTarget });
        await me.signout({
            requestType: "so:p",
            postLogoutRedirectUri: url,
            // we're putting a dummy entry in here because we
            // need a unique id from the state for notification
            // to the parent window, which is necessary if we
            // plan to return back to the client after signout
            // and so we can close the popup after signout
            state: url == null ? undefined : {},
            ...requestArgs,
        }, handle);
        Logger.info(me.signoutPopup, "success");
    },

    /**
     * Process response (callback) from the end session endpoint from a popup window.
     * It is recommend to use {@link UserManager.signoutCallback} instead.
     *
     * @returns A promise
     *
     * @see {@link UserManager.signoutCallback}
     */
    async signoutPopupCallback(url, keepOpen) {
        let me = this;
        Logger.debug(me.signoutPopupCallback, "signoutPopupCallback");
        url = url || window.location.href;
        await me.getPopupNavigator().callback(url, { keepOpen });
        Logger.info(me.signoutPopupCallback, "success");
    },

    /**
     * Trigger a silent request (via an iframe) to the end session endpoint.
     *
     * @returns A promise
     */
    async signoutSilent(args) {
        let me = this,
            settings = me.settings;
        Logger.debug(me.signoutSilent, "signoutSilent");
        args = args || {};
        let {
            silentRequestTimeoutInSeconds,
            ...requestArgs
        } = args;

        let idTokenHint = undefined;
        if (settings.includeIdTokenInSilentSignout) {
            let user = await me.loadUser();
            if (user) {
                idTokenHint = user.idToken;
            }
        }

        let url = settings.popupPostLogoutRedirectUri;
        let handle = await me.getIframeNavigator().prepare({ silentRequestTimeoutInSeconds });
        await me.signout({
            requestType: "so:s",
            popupPostLogoutRedirectUri: url,
            idTokenHint: idTokenHint,
            ...requestArgs,
        }, handle);

        Logger.info(me.signoutSilent, "success");
    },

    /**
     * Notify the parent window of response (callback) from the end session endpoint.
     * It is recommend to use {@link UserManager.signoutCallback} instead.
     *
     * @returns A promise
     *
     * @see {@link UserManager.signoutCallback}
     */
    async signoutSilentCallback(url) {
        let me = this;
        url = url || window.location.href;
        Logger.debug(me.signoutSilentCallback, "signoutSilentCallback");
        await me.getIframeNavigator().callback(url);
        Logger.info(me.signoutSilentCallback, "success");
    },

    async revokeTokens(types) {
        let user = await this.loadUser();
        await this.revokeInternal(user, types);
    },

    /**
     * Enables silent renew for the `UserManager`.
     */
    startSilentRenew() {
        let me = this;
        Logger.debug(me.startSilentRenew, "startSilentRenew");
        me.silentRenewService.start();
    },

    /**
     * Disables silent renew for the `UserManager`.
     */
    stopSilentRenew() {
        this.silentRenewService.stop();
    },

    async storeUser(user) {
        let me = this,
            store = me.settings.userStore;
        Logger.debug(me.storeUser, "storeUser");
        if (user) {
            Logger.debug(me.storeUser, "storing user");
            let storageString = user.toStorageString();
            await store.set(me.getUserStoreKey(), storageString);
            AppStorage.set('accessToken', user.accessToken);
        }
        else {
            Logger.debug(me.storeUser, "removing user");
            await store.remove(me.getUserStoreKey());
            AppStorage.remove('accessToken');
        }
    },

    /**
     * Removes stale state entries in storage for incomplete authorize requests.
     */
    async clearStaleState() {
        await this.getClient().clearStaleState();
    },

    destroy() {
        let me = this;
        if(me.settings.automaticSilentRenew){
            Ext.un('documentVisibilityChange', me.onDocumentVisibilityChange.bind(me));
        }
        this.destroyMembers('settings', 'client', 'redirectNavigator', 'popupNavigator', 'iframeNavigator', 'events', 'silentRenewService', 'sessionMonitor');
        this.callParent();
    },

    privates: {
        async useRefreshToken(state) {
            let me = this,
                response = await me.getClient().useRefreshToken({
                    state,
                    timeoutInSeconds: me.settings.silentRequestTimeoutInSeconds,
                });
            let user = Ext.create('oidc.user', { ...state, ...response });

            await me.storeUser(user);
            me.events.load(user);
            return user;
        },

        async signin(args, handle, verifySub) {
            let navResponse = await this.signinStart(args, handle);
            return await this.signinEnd(navResponse.url, verifySub);
        },


        async signinStart(args, handle) {
            let me = this;
            Logger.debug(me.signinStart, "signinStart")

            try {
                let signinRequest = await me.getClient().createSigninRequest(args);
                Logger.debug(me.signinStart, "got signin request", handle);

                return await handle.navigate({
                    url: signinRequest.url,
                    state: signinRequest.state.id,
                    responseMode: signinRequest.state.responseMode,
                    scriptOrigin: me.settings.iframeScriptOrigin,
                });
            }
            catch (err) {
                Logger.debug(me.signinStart, "error after preparing navigator, closing navigator window");
                handle.close();
                throw err;
            }
        },

        async signinEnd(url, verifySub) {
            let me = this;
            Logger.debug(me.signinEnd, "signinEnd")
            let signinResponse = await me.getClient().processSigninResponse(url);
            Logger.debug(me.signinEnd, "got signin response");

            let user = await me.buildUser(signinResponse, verifySub);
            return user;
        },

        async buildUser(signinResponse, verifySub) {
            let me = this;
            Logger.debug(me.buildUser, "buildUser")
            let user = Ext.create('oidc.user', signinResponse);
            if (verifySub) {
                if (verifySub !== user.profile.sub) {
                    Logger.debug(me.buildUser, "current user does not match user returned from signin. sub from signin:", user.profile.sub);
                    throw Oidc.ErrorResponse.create({ ...signinResponse, error: "login_required" });
                }
                Logger.debug(me.buildUser, "current user matches user returned from signin");
            }

            await me.storeUser(user);
            Logger.debug(me.buildUser, "user stored");
            me.events.load(user);

            return user;
        },

        async signout(args, handle) {
            let navResponse = await this.signoutStart(args, handle);
            return await this.signoutEnd(navResponse.url);
        },

        async signoutStart(args, handle) {
            let me = this;
            Logger.debug(me.signoutStart, "signoutStart")

            try {
                let user = await me.loadUser();
                Logger.debug(me.signoutStart, "loaded current user from storage");

                if (me.settings.revokeTokensOnSignout) {
                    await me.revokeInternal(user);
                }

                let idToken = args.idTokenHint || user && user.idToken;
                if (idToken) {
                    Logger.debug(me.signoutStart, "setting id_token_hint in signout request");
                    args.idTokenHint = idToken;
                }

                await me.removeUser();
                Logger.debug(me.signoutStart, "user removed, creating signout request");

                let signoutRequest = await me.getClient().createSignoutRequest(args);
                Logger.debug(me.signoutStart, "got signout request");

                return await handle.navigate({
                    url: signoutRequest.url,
                    state: signoutRequest.state && signoutRequest.state.id,
                    scriptOrigin: this.settings.iframeScriptOrigin,
                });
            }
            catch (err) {
                Logger.debug(me.signoutStart, "error after preparing navigator, closing navigator window");
                handle.close();
                throw err;
            }
        },

        async signoutEnd(url) {
            let me = this;
            Logger.debug(me.signoutEnd, "signoutEnd")
            let signoutResponse = await me.getClient().processSignoutResponse(url);
            Logger.debug(me.signoutEnd, "got signout response");

            return signoutResponse;
        },

        async revokeInternal(user, types) {
            let me = this,
                settings = me.settings;
            Logger.debug(me.revokeInternal, "revokeInternal")

            types = types || settings.revokeTokenTypes;
            if (!user) return;

            let typesPresent = types.filter(type => typeof user[type] === "string");

            if (!typesPresent.length) {
                Logger.debug(me.revokeInternal, "no need to revoke due to no token(s)");
                return;
            }

            // don't Promise.all, order matters
            for (let type of typesPresent) {
                await me.getClient().revokeToken(
                    user[type], // eslint-disable-line @typescript-eslint/no-non-null-assertion
                    type,
                );
                Logger.info(me.revokeInternal, `${type} revoked successfully`);
                if (type !== "accessToken") {
                    user[type] = null;
                }
            }

            await me.storeUser(user);
            Logger.debug(me.revokeInternal, "user stored");
            me.events.load(user);
        },

        getUserStoreKey() {
            return `user:${this.settings.authority}:${this.settings.clientId}`;
        },

        async loadUser() {
            let me = this,
                settings = me.settings;
            Logger.debug(me.loadUser, "loadUser")
            let storageString = await settings.userStore.get(me.getUserStoreKey());
            if (storageString) {
                Logger.debug(me.loadUser, "user storageString loaded");
                return Common.oidc.User.fromStorageString(storageString);
            }

            Logger.debug(me.loadUser, "no user storageString");
            return null;
        },

        onDocumentVisibilityChange(state){
            let me = this;
            if(state === 'hidden'){
                me.stopSilentRenew();
            }

            if(state === 'visible'){
                me.startSilentRenew();
            }
        }


    }


});
