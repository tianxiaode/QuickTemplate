Ext.define('Common.oidc.service.SilentRenew', {
    alias: 'oidc.service.silentrenew',

    isStarted: false,

    constructor(userManager){
        let me = this;
        me.userManager = userManager;
        me.retryTimer = Ext.create('oidc.timer', 'Retry Silent Renew');
    },

    async start(){
        let me = this,
            userManager = me.userManager;
        if (!me.isStarted) {
            me.isStarted = true;
            userManager.events.addAccessTokenExpiring(me.tokenExpiring);
            me.retryTimer.addHandler(me.tokenExpiring);

            // this will trigger loading of the user so the expiring events can be initialized
            try {
                await userManager.getUser();
                // deliberate nop
            }
            catch (err) {
                // catch to suppress errors since we're in a ctor
                Logger.error(me , "getUser error", err);
            }
        }
    },

    stop() {
        let me = this;
        if (me.isStarted) {
            me.retryTimer.cancel();
            me.retryTimer.removeHandler(me.tokenExpiring);
            me.userManager.events.removeAccessTokenExpiring(me.tokenExpiring);
            me.isStarted = false;
        }
    },


    destroy() {
        this.destroyMembers('userManager');
        this.callParent();
    },

    privates:{
        async tokenExpiring (){
            let me = this;
            try {
                await me.userManager.signinSilent();
                Logger.debug(me, "silent token renewal successful");
            }
            catch (err) {
                if (err.name === 'ErrorTimeout') {
                    // no response from authority server, e.g. IFrame timeout, ...
                    Logger.warn(me, "ErrorTimeout from signinSilent:", err, "retry in 5s");
                    me.retryTimer.init(5);
                    return;
                }
    
                Logger.error(me, "Error from signinSilent:", err);
                me.userManager.events.raiseSilentRenewError(err);
            }
        }        
    }


})
