Ext.define('Common.oidc.event.Timer',{
    extend: 'Common.oidc.event.Event',
    alias: 'oidc.event.timer',

    timerHandle: null,
    expiration: 0,

    init(durationInSeconds) {
        let me = this;
        durationInSeconds = Math.max(Math.floor(durationInSeconds), 1);
        let expiration = Format.getEpochTime() + durationInSeconds;
        if (me.expiration === expiration && me.timerHandle) {
            // no need to reinitialize to same expiration, so bail out
            Logger.debug(me.init ,  "skipping since already initialized for expiration at", me.expiration);
            return;
        }

        me.cancel();

        Logger.debug(me.init,  "using duration", durationInSeconds);
        me.expiration = expiration;

        // we're using a fairly short timer and then checking the expiration in the
        // callback to handle scenarios where the browser device sleeps, and then
        // the timers end up getting delayed.
        let timerDurationInSeconds = Math.min(durationInSeconds, 5);
        me.timerHandle = setInterval(me.callback.bind(me), timerDurationInSeconds * 1000);
    },

    getExpiration() {
        return this.expiration;
    },

    cancel() {        
        let me = this;
        Logger.debug(me.cancel);
        if (me.timerHandle) {
            clearInterval(me.timerHandle);
            me.timerHandle = null;
        }
    },

    callback(){
        let me = this,
            diff = me.expiration - Format.getEpochTime();
        Logger.debug(me.callback,  "timer completes in", diff);

        if (me.expiration <= Format.getEpochTime()) {
            me.cancel();
            me.raise();
        }
    },

    destroy() {
        this.destroyMembers('timerHandle');
        this.callParent();
    }

})