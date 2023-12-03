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
                automaticSilentRenew: true
            };
        me.settings
        me.userManager = Ext.create('oidc.usermanager', settings);
    },

    async login(){
        let me = this,
            userManager = me.userManager;
        Logger.debug(me.login);
        if(userManager.settings.responseType === 'code'){
            return me.signinRedirect();
        }

    },

    isAuthenticated(){
        let me = this,
            storage = AppStorage,
            keys = me.storageKeys,
            token = storage.get(keys.accessToken);
        if(token){
            let expiresAt = storage.get(keys.expiresAt),
                now = new Date(),
                isAuthenticated = expiresAt && parseInt(expiresAt, 10) > now.getTime();
            //如果token已过期，清除全部数据
            if(!isAuthenticated) me.removeAllStorageItem();
            return isAuthenticated;
        }
        return false;
    },

    privates:{
        async signinRedirect(){
            let me = this,
                userManager = me.userManager,
                params = new URLSearchParams(window.location.href);
            if(params.has('state')){
                return await userManager.signinRedirectCallback();
            }
            return userManager.signinRedirect();

        }
    }

})