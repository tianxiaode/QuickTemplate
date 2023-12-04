Ext.define('Common.oidc.service.SilentRenew', {
    alias: 'oidc.service.silentrenew',

    requires:[
        'Common.oidc.event.Timer'
    ],

    isStarted: false,

    constructor(userManager){
        let me = this;
        me.userManager = userManager;
        me.retryTimer = Ext.create('oidc.event.timer', 'Retry Silent Renew');
        Ext.on('tokenExpiring', me.tokenExpiring.bind(me));
    },

    async start(){
        let me = this,
            userManager = me.userManager;
            Logger.debug(this.start);
        if (!me.isStarted) {
            me.isStarted = true;
            userManager.events.addAccessTokenExpiring(me.fireTokenExpiringEvent);
            me.retryTimer.addHandler(me.fireTokenExpiringEvent);

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
            me.retryTimer.removeHandler(me.fireTokenExpiringEvent);
            me.userManager.events.removeAccessTokenExpiring(me.fireTokenExpiringEvent);
            me.isStarted = false;
        }
    },


    destroy() {
        this.destroyMembers('userManager');
        Ext.un('tokenExpiring', me.tokenExpiring.bind(me));
        this.callParent();
    },

    privates:{

        fireTokenExpiringEvent(){
            Logger.debug(this.fireTokenExpiringEvent)
            Ext.fireEvent('tokenExpiring');
        },

        async tokenExpiring (){
            let me = this;
            try {
                await me.userManager.signinSilent();
                Logger.debug(me.tokenExpiring, "silent token renewal successful");
            }
            catch (err) {
                if (err.name === 'ErrorTimeout') {
                    // no response from authority server, e.g. IFrame timeout, ...
                    Logger.warn(me.tokenExpiring, "ErrorTimeout from signinSilent:", err, "retry in 5s");
                    me.retryTimer.init(5);
                    return;
                }
    
                Logger.error(me.tokenExpiring, "Error from signinSilent:", err);
                me.userManager.events.raiseSilentRenewError(err);
            }
        }        
    }


})
