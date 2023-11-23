Ext.define('Common.oidc.SessionMonitor',{
    alias: 'oidc.sessionmonitor',

    requires:[
        'Common.oidc.CheckSessionIFrame'
    ],

    constructor(config){
        let me = this;
        if(!config.userManager){
            throw new Error('No user manager passed');
        }

        me.userManager = config.userManager;
        me.userManager.events.addUserLoaded(me.start.bind(me));
        me.userManager.events.addUserUnloaded(me.stop.bind(me));
        me.init().catch((err)=>{
            Logger.error(me, err)
        })
    },

    destroy() {
        this.destroyMembers('userManager', 'sub', 'sid', 'checkSessionIFrame');
        this.callParent();
    },

    privates:{
        async init(){
            let me = this,
                user = await me.userManager.getUser();

            if(user){
                me.start(user);
                return;
            }

            if(me.userManager.settings.monitorAnonymousSession){
                let session = await me.userManager.querySessionStatus();
                if(session){
                    let tempUser = {
                        sessionState: session.sessionState,
                        profile: session.sub && session.sid ? {
                            sub: session.sub,
                            sid: session.sid
                        } : null
                    };
                    me.start(tempUser);    
                }
            }
        },

        async start(user){
            let me = this,
                userManager = me.userManager,
                settings = userManager.settings,
                sessionState = user.sessionState;
            if (!sessionState) {
                return;
            }
    
            if (user.profile) {
                me.sub = user.profile.sub;
                me.sid = user.profile.sid;
                Logger.debug(me.start, "sessionState", sessionState, ", sub", me.sub);
            }
            else {
                me.sub = undefined;
                me.sid = undefined;
                Logger.debug(me.start, "sessionState", sessionState, ", anonymous user");
            }
    
            if (me.checkSessionIFrame) {
                me.checkSessionIFrame.start(sessionState);
                return;
            }
    
            try {
                let url = await userManager.metadataService.getCheckSessionIframe();
                if (url) {
                    Logger.debug(me.start, "initializing check session iframe");
    
                    let clientId = settings.clientId;
                    let intervalInSeconds = settings.checkSessionIntervalInSeconds;
                    let stopOnError = settings.stopCheckSessionOnError;
    
                    let checkSessionIFrame = Ext.create('oidc.checksessioniFrame', {callback: me.callback.bind(me), clientId, url, intervalInSeconds, stopOnError});
                    await checkSessionIFrame.load();
                    me.checkSessionIFrame = checkSessionIFrame;
                    checkSessionIFrame.start(sessionState);
                }
                else {
                    Logger.warn(me.start, "no check session iframe found in the metadata");
                }
            }
            catch (err) {
                // catch to suppress errors since we're in non-promise callback
                Logger.error(me.start, "Error from getCheckSessionIframe:", err instanceof Error ? err.message : err);
            }
        },

        async stop(){
            let me = this,
                userManager = me.userManager,
                settings = userManager.settings;
            me.sub = undefined;
            me.sid = undefined;
    
            if (me.checkSessionIFrame) {
                me.checkSessionIFrame.stop();
            }
    
            if (settings.monitorAnonymousSession) {
                // using a timer to delay re-initialization to avoid race conditions during signout
                // TODO rewrite to use promise correctly
                // eslint-disable-next-line @typescript-eslint/no-misused-promises
                let timerHandle = setInterval(async () => {
                    clearInterval(timerHandle);
    
                    try {
                        let session = await userManager.querySessionStatus();
                        if (session) {
                            let tmpUser = {
                                sessionState: session.sessionState,
                                profile: session.sub && session.sid ? {
                                    sub: session.sub,
                                    sid: session.sid,
                                } : null
                            };
                            me.start(tmpUser);
                        }
                    }
                    catch (err) {
                        // catch to suppress errors since we're in a callback
                        Logger.error(me, "error from querySessionStatus", err instanceof Error ? err.message : err);
                    }
                }, 1000);
            }
        },
    
        async callback(){
            let me = this,
                userManager = me.userManager,
                settings = userManager.settings;
            try {
                let session = await userManager.querySessionStatus();
                let raiseEvent = true;
    
                if (session && me.checkSessionIFrame) {
                    if (session.sub === me.sub) {
                        raiseEvent = false;
                        me.checkSessionIFrame.start(session.sessionState);
    
                        if (session.sid === me.sid) {
                            Logger.debug(me.callback, "same sub still logged in at OP, restarting check session iframe; session_state", session.sessionState);
                        }
                        else {
                            Logger.debug(me.callback, "same sub still logged in at OP, session state has changed, restarting check session iframe; session_state", session.sessionState);
                            userManager.events.raiseUserSessionChanged();
                        }
                    }
                    else {
                        Logger.debug(me.callback, "different subject signed into OP", session.sub);
                    }
                }
                else {
                    Logger.debug(me.callback, "subject no longer signed into OP");
                }
    
                if (raiseEvent) {
                    if (me.sub) {
                        userManager.events.raiseUserSignedOut();
                    }
                    else {
                        userManager.events.raiseUserSignedIn();
                    }
                } else {
                    Logger.debug(me.callback, "no change in session detected, no event to raise");
                }
            }
            catch (err) {
                if (me.sub) {
                    Logger.debug(me.callback, "Error calling queryCurrentSigninSession; raising signed out event", err);
                    userManager.events.raiseUserSignedOut();
                }
            }
        }
    
    }

});
