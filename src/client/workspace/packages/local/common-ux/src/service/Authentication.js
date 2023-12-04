Ext.define('Common.service.Authentication',{
    alias: 'service.authentication',
    // alternateClassName: 'Auth',
    // singleton: true,

    mixins:[
        'Ext.mixin.Observable',
        'Common.oidc.UserManager'
    ],

    constructor(){
        let me = this,
            config = AppConfig,
            name = Ext.getApplication().getName().toLowerCase(),
            appConfig = config[name];
            issuer = appConfig && appConfig['issuer'],
            redirectUri = appConfig && appConfig['redirectUri'],
            settings = {
                authority: config.authority,
                issuer: issuer || config.issuer,
                redirectUri: redirectUri,
                clientId: config.clientId,
                scope: config.scope,
                responseType: config.responseType,
                disablePKCE: true,
                automaticSilentRenew: true,
                userStore: Ext.create('oidc.state.store')
            };
        me.userManager = Ext.create('oidc.usermanager', settings);
    },

    async login(){
        let me = this,
            userManager = me.userManager,
            href = window.location.href;
        if(!me.hasAuthParams()){
            AppStorage.set('origin-href', href);
        }
        Logger.debug(me.login);
        if(userManager.settings.responseType === 'code'){
            return me.signinRedirect();
        }

    },

    async isAuthenticated(){
        let me = this,
            user =  await me.userManager.getUser();
        Logger.debug(me.isAuthenticated, user);
        if(user){
            me.user = user;
            return Promise.resolve(user);
        }
        return Promise.reject();
    },

    getAccesssToken(){
        return this.user.accessToken;
    },

    privates:{
        async signinRedirect(){
            let me = this,
                userManager = me.userManager;
            if(me.hasAuthParams()){
                try {
                    me.user = await userManager.signinRedirectCallback();
                    let origin = AppStorage.get('origin-href');
                    Logger.debug(me.signinRedirect, '已获取token', me.user);
                    window.location.href = origin;
                    AppStorage.remove('origin-href');
                } catch (error) {
                    Logger.debug(me.signinRedirect, '获取toke失败');
                    Alert.error('获取toke失败');
                }
                return;
            }
            return userManager.signinRedirect();

        },

        hasAuthParams(){
            let searchParams = new URLSearchParams(window.location.search);
            if ((searchParams.get("code") || searchParams.get("error")) &&
                searchParams.get("state")) {
                return true;
            }
            return false;  
        }
    }

})