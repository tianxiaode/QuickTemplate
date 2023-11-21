Ext.define('Common.oidc.event.AccessToken', {
    alias: 'oidc.event.accesstoken',

    requires: [
        'Common.oidc.event.Timer'
    ],

    expiringTimer: null,
    expiredTimer: null,
    expiringNotificationTimeInSeconds: null,

    constructor(expiringNotificationTimeInSeconds) {
        let me = this;
        me.expiringTimer = Ext.create('oidc.event.timer', 'Access token expiring');
        me.expiredTimer = Ext.create('oidc.event.timer', 'Access token expired');
        me.expiringNotificationTimeInSeconds = expiringNotificationTimeInSeconds;
    },

    load(container) {
        let me = this;
        // only register events if there's an access token and it has an expiration
        if (container.accessToken && container.expiresIn !== undefined) {
            let duration = container.expiresIn;
            Logger.debug(me, "access token present, remaining duration:", duration);

            if (duration > 0) {
                // only register expiring if we still have time
                let expiring = duration - me.expiringNotificationTimeInSeconds;
                if (expiring <= 0) {
                    expiring = 1;
                }

                Logger.debug(me, "registering expiring timer, raising in", expiring, "seconds");
                me.expiringTimer.init(expiring);
            }
            else {
                Logger.debug(me, "canceling existing expiring timer because we're past expiration.");
                me.expiringTimer.cancel();
            }

            // if it's negative, it will still fire
            let expired = duration + 1;
            Logger.debug(me, "registering expired timer, raising in", expired, "seconds");
            me.expiredTimer.init(expired);
        }
        else {
            me.expiringTimer.cancel();
            me.expiredTimer.cancel();
        }
    },

    unload() {
        this.expiringTimer.cancel();
        this.expiredTimer.cancel();
    },

    /**
 * Add callback: Raised prior to the access token expiring.
 */
    addAccessTokenExpiring(cb) {
        return () => this.expiringTimer.addHandler(cb);
    },
    /**
     * Remove callback: Raised prior to the access token expiring.
     */
    removeAccessTokenExpiring(cb) {
        this.expiringTimer.removeHandler(cb);
    },

    /**
     * Add callback: Raised after the access token has expired.
     */
    addAccessTokenExpired(cb) {
        return () => this.expiredTimer.addHandler(cb);
    },
    /**
     * Remove callback: Raised after the access token has expired.
     */
    removeAccessTokenExpired(cb) {
        this.expiredTimer.removeHandler(cb);
    },


    destroy() {
        this.destroyMembers('expiringTimer', 'expiredTimer');
        this.callParent();
    }

})
