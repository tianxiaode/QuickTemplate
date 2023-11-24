Ext.define('Common.oidc.setting.UserManager', {
    extend: 'Common.oidc.setting.Client',
    alias: 'oidc.setting.usermanager',

    requires:[
        'Common.oidc.storage.Memory',
        'Common.oidc.state.Store'
    ],


    /** The URL for the page containing the call to signinPopupCallback to handle the callback from the OIDC/OAuth2 */
    popupRedirectUri: null,
    popupPostLogoutRedirectUri: null,
    /**
     * The features parameter to window.open for the popup signin window. By default, the popup is
     * placed centered in front of the window opener.
     * (default: \{ location: false, menubar: false, height: 640, closePopupWindowAfterInSeconds: -1 \})
     */
    popupWindowFeatures: null,
    /** The target parameter to window.open for the popup signin window (default: "_blank") */
    popupWindowTarget: '_blank',
    /** The methods window.location method used to redirect (default: "assign") */
    redirectMethod: 'assign',
    /** The methods target window being redirected (default: "self") */
    redirectTarget: 'self',

    /** The target to pass while calling postMessage inside iframe for callback (default: window.location.origin) */
    iframeNotifyParentOrigin: null,

    /** The script origin to check during 'message' callback execution while performing silent auth via iframe (default: window.location.origin) */
    iframeScriptOrigin: null,

    /** The URL for the page containing the code handling the silent renew */
    silentRedirectUri: null,
    /** Number of seconds to wait for the silent renew to return before assuming it has failed or timed out (default: 10) */
    silentRequestTimeoutInSeconds: 10,
    /** Flag to indicate if there should be an automatic attempt to renew the access token prior to its expiration. The automatic renew attempt starts 1 minute before the access token expires (default: true) */
    automaticSilentRenew: true,
    /** Flag to validate user.profile.sub in silent renew calls (default: true) */
    validateSubOnSilentRenew: true,
    /** Flag to control if id_token is included as id_token_hint in silent renew calls (default: false) */
    includeIdTokenInSilentRenew: false,

    /** Will raise events for when user has performed a signout at the OP (default: false) */
    monitorSession: false,
    monitorAnonymousSession: false,
    /** Interval in seconds to check the user's session (default: 2) */
    checkSessionIntervalInSeconds: 2,
    queryStatusResponseType: null,
    stopCheckSessionOnError: true,

    /**
     * The `token_type_hint`s to pass to the authority server by default (default: ["access_token", "refresh_token"])
     *
     * Token types will be revoked in the same order as they are given here.
     */
    revokeTokenType: null,
    /** Will invoke the revocation endpoint on signout if there is an access token for the user (default: false) */
    revokeTokensOnSignout: false,
    /** Flag to control if id_token is included as id_token_hint in silent signout calls (default: false) */
    includeIdTokenInSilentSignout: false,

    /** The number of seconds before an access token is to expire to raise the accessTokenExpiring event (default: 60) */
    accessTokenExpiringNotificationTimeInSeconds: 60,

    /**
     * Storage object used to persist User for currently authenticated user (default: window.sessionStorage, InMemoryWebStorage iff no window).
     *  E.g. `userStore: new WebStorageStateStore({ store: window.localStorage })`
     */
    userStore: null,

     defaultPopupWindowFeatures: {
        location: false,
        toolbar: false,
        height: 640,
        closePopupWindowAfterInSeconds: -1    
     },
     defaultAccessTokenExpiringNotificationTimeInSeconds: 60,
     defaultCheckSessionIntervalInSeconds: 2,
     defaultSilentRequestTimeoutInSeconds: 10,


     constructor(config){
        let me = this;
        me.callParent(arguments);
        me.popupRedirectUri = me.popupRedirectUri || me.redirectUri;
        me.popupWindowFeatures = me.popupWindowFeatures || Ext.clone(me.defaultPopupWindowFeatures);
        me.popupWindowTarget = me.popupWindowTarget || '_blank';
        me.redirectMethod = me.redirectMethod || 'assign';
        me.redirectTarget = me.redirectTarget || 'self';
        me.silentRedirectUri = me.silentRedirectUri || me.redirectUri;
        me.silentRequestTimeoutInSeconds = me.silentRequestTimeoutInSeconds || me.defaultSilentRequestTimeoutInSeconds;
        me.automaticSilentRenew = Ext.isEmpty(me.automaticSilentRenew) ? true : me.automaticSilentRenew;
        me.validateSubOnSilentRenew = Ext.isEmpty(me.validateSubOnSilentRenew) ? true : me.validateSubOnSilentRenew;
        me.includeIdTokenInSilentRenew = me.includeIdTokenInSilentRenew || false;
        me.monitorSession = me.monitorSession || false;
        me.monitorAnonymousSession = me.monitorAnonymousSession || false;
        me.checkSessionIntervalInSeconds = me.checkSessionIntervalInSeconds || me.defaultCheckSessionIntervalInSeconds;
        me.queryStatusResponseType = me.queryStatusResponseType || 'code';
        me.stopCheckSessionOnError = Ext.isEmpty(me.stopCheckSessionOnError) ? true : me.stopCheckSessionOnError;
        me.revokeTokenTypes = me.revokeTokenTypes || ['access_token', 'refresh_token'];
        me.revokeTokensOnSignout = me.revokeTokensOnSignout || false;
        me.includeIdTokenInSilentSignout = me.includeIdTokenInSilentSignout || false;
        me.accessTokenExpiringNotificationTimeInSeconds = me.accessTokenExpiringNotificationTimeInSeconds || me.defaultAccessTokenExpiringNotificationTimeInSeconds;

        if (!me.userStore) {
            let store = typeof window !== "undefined" ? window.sessionStorage : Ext.create('oidc.storage.memory');
            me.userStore = Ext.create('oidc.state.store', store);
        }

     },


    destroy() {
        this.destroyMembers('revokeTokenTypes', 'defaultPopupWindowFeatures', 'popupWindowFeatures');
        this.callParent();
    }


});
