Ext.define('Common.oidc.event.Timer',{
    extend: 'Common.oidc.event.Event',
    alias: 'oidc.event.timer',

    timerHandle: null,
    _expiration: 0,

    statics:{
        getEpochTime() {
            return Math.floor(Date.now() / 1000);
        }
    },

    init(durationInSeconds) {
        let me = this;
        durationInSeconds = Math.max(Math.floor(durationInSeconds), 1);
        let expiration = Oidc.Timer.getEpochTime() + durationInSeconds;
        if (me._expiration === expiration && me.timerHandle) {
            // no need to reinitialize to same expiration, so bail out
            Logger.debug(me.init ,  "skipping since already initialized for expiration at", me._expiration);
            return;
        }

        me.cancel();

        Logger.debug(me.init,  "using duration", durationInSeconds);
        me._expiration = expiration;

        // we're using a fairly short timer and then checking the expiration in the
        // callback to handle scenarios where the browser device sleeps, and then
        // the timers end up getting delayed.
        let timerDurationInSeconds = Math.min(durationInSeconds, 5);
        me.timerHandle = setInterval(me.callback.bind(me), timerDurationInSeconds * 1000);
    },

    getExpiration() {
        return this._expiration;
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
            diff = me._expiration -  Oidc.Timer.getEpochTime();
        Logger.debug(me.callback,  "timer completes in", diff);

        if (me._expiration <=  Oidc.Timer.getEpochTime()) {
            me.cancel();
            me.raise();
        }
    },

    destroy() {
        this.destroyMembers('timerHandle');
        this.callParent();
    }

},()=>{
    window.Oidc = window.Oidc || {};
    Oidc.Timer = Common.oidc.event.Timer;
})