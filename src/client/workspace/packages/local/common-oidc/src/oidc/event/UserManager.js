Ext.define('Common.oidc.event.UserManager', {
    extend: 'Common.oidc.event.AccessToken',
    alias: 'oidc.event.usermanager',

    constructor() {
        let me = this;
        me.callParent(arguments);
        me.userLoaded = Ext.create('oidc.event.event', 'User loaded');
        me.userUnloaded = Ext.create('oidc.event.event', 'User unloaded');
        me.silentRenewError = Ext.create('oidc.event.event', 'Silent renew error');
        me.userSignedIn = Ext.create('oidc.event.event', 'User signed in');
        me.userSignedOut = Ext.create('oidc.event.event', 'User signed out');
        me.userSessionChanged = Ext.create('oidc.event.event', 'User session changed');
    },

    load(user, raiseEvent) {
        let me = this;
        me.callParent(arguments);
        if (raiseEvent) {
            me.userLoaded.raise(user);
        }
    },

    unload() {
        let me = this;
        me.callParent();
        me.userUnloaded.raise();
    },

    /**
     * Add callback: Raised when a user session has been established (or re-established).
     */
    addUserLoaded(cb) {
        return this.userLoaded.addHandler(cb);
    },

    /**
     * Remove callback: Raised when a user session has been established (or re-established).
     */
    removeUserLoaded(cb) {
        return this.userLoaded.removeHandler(cb);
    },

    /**
     * Add callback: Raised when a user session has been terminated.
     */
    addUserUnloaded(cb) {
        return this.userUnloaded.addHandler(cb);
    },

    /**
     * Remove callback: Raised when a user session has been terminated.
     */
    removeUserUnloaded(cb) {
        return this.userUnloaded.removeHandler(cb);
    },

    /**
     * Add callback: Raised when the automatic silent renew has failed.
     */
    addSilentRenewError(cb) {
        return this.silentRenewError.addHandler(cb);
    },
    /**
     * Remove callback: Raised when the automatic silent renew has failed.
     */
    removeSilentRenewError(cb) {
        return this.silentRenewError.removeHandler(cb);
    },


    /**
 * @internal
 */
    raiseSilentRenewError(e) {
        this.silentRenewError.raise(e);
    },

    /**
     * Add callback: Raised when the user is signed in (when `monitorSession` is set).
     * @see {@link UserManagerSettings.monitorSession}
     */
    addUserSignedIn(cb) {
        return this.userSignedIn.addHandler(cb);
    },

    /**
      * Remove callback: Raised when the user is signed in (when `monitorSession` is set).
      */
    removeUserSignedIn(cb) {
        this.userSignedIn.removeHandler(cb);
    },
    /**
     * @internal
     */
    raiseUserSignedIn() {
        this.userSignedIn.raise();
    },

    /**
     * Add callback: Raised when the user's sign-in status at the OP has changed (when `monitorSession` is set).
     * @see {@link UserManagerSettings.monitorSession}
     */
    addUserSignedOut(cb) {
        return this.userSignedOut.addHandler(cb);
    },
    /**
     * Remove callback: Raised when the user's sign-in status at the OP has changed (when `monitorSession` is set).
     */
    removeUserSignedOut(cb) {
        this.userSignedOut.removeHandler(cb);
    },
    /**
     * @internal
     */
    raiseUserSignedOut() {
        this.userSignedOut.raise();
    },

    /**
  * Add callback: Raised when the user session changed (when `monitorSession` is set).
  * @see {@link UserManagerSettings.monitorSession}
  */
    addUserSessionChanged(cb) {
        return this.userSessionChanged.addHandler(cb);
    },
    /**
     * Remove callback: Raised when the user session changed (when `monitorSession` is set).
     */
    removeUserSessionChanged(cb) {
        this.userSessionChanged.removeHandler(cb);
    },
    /**
     * @internal
     */
    raiseUserSessionChanged() {
        this.userSessionChanged.raise();
    },

    destroy() {
        this.destroyMembers('userLoaded', 'userUnloaded', 'silentRenewErro', 'userSignedIn', 'userSignedOut', 'userSessionChanged');
        this.callParent();
    }



});