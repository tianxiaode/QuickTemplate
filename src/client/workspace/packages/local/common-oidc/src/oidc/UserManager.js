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
        me.client = Ext.create('oidc.client', settings);
        me.redirectNavigator = me.redirectNavigator || Ext.create('oidc.navigator.redirect', settings);
        me.popupNavigator = me.popupNavigator || Ext.create('oidc.navigator.popup', settings);
        me.iframeNavigator = me.iframeNavigator || Ext.create('oidc.navigator.iframe', settings);
        me.events = Ext.create('oidc.event.usermanager', settings);
        me.silentRenewService = Ext.create('oidc.service.silentrenew', me);

        if (settings.automaticSilentRenew) {
            me.startSilentRenew();
        }

        me.sessionMonitor = null;
        if (settings.monitorSession) {
            me.sessionMonitor = Ext.create('oidc.sessionmonitor', me);
        }
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
        return this.client.metadataService;
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
        let {
            redirectMethod,
            ...requestArgs
        } = args;
        let handle = await me.redirectNavigator.prepare({ redirectMethod });
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
        Logger.debug(me.signinRedirectCallback, "signinRedirectCallback");
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
    async signinResourceOwnerCredentials({
        username,
        password,
        skipUserInfo = false,
    }) {
        let me = this;
        skipUserInfo = Ext.isEmpty(skipUserInfo) ? false : skipUserInfo;
        Logger.debug(me.signinResourceOwnerCredentials, "signinResourceOwnerCredentials");

        let signinResponse = await me.client.processResourceOwnerPasswordCredentials({ username, password, skipUserInfo, extraTokenParams: this.settings.extraTokenParams });
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

        let handle = await me.popupNavigator.prepare({ popupWindowFeatures, popupWindowTarget });
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


    destroy() {
        this.destroyMembers('settings', 'client', 'redirectNavigator', 'popupNavigator', 'iframeNavigator', 'events', 'silentRenewService', 'sessionMonitor');
        this.callParent();
    }


});
