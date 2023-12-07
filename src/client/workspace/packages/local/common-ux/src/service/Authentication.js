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
            redirectUri = appConfig && appConfig['redirectUri'],
            settings = {
                authority: config.authority,
                redirectUri: redirectUri,
                clientId: config.clientId,
                scope: config.scope,
                responseType: config.responseType,
                disablePKCE: true,
                automaticSilentRenew: true,
                userStore: Ext.create('oidc.state.store'),
                revokeTokensOnSignout: true,
                postLogoutRedirectUri: redirectUri
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
        if(userManager.settings.responseType === 'code'){
            return me.signinRedirect();
        }
        Logger.debug(me.login, userManager.settings.responseType)
        Ext.History.add('login');
    },

    signinResourceOwnerCredentials(username, password){
        return this.userManager.signinResourceOwnerCredentials({username, password, culture: 'zh-Hans', 'ui-culture': 'zh-Hans'});
    },

    async isAuthenticated(){
        let me = this,
            user =  await me.userManager.getUser();
        if(user){
            me.user = user;
            if(user.isExpired()) return Promise.reject();
            return Promise.resolve(user);
        }
        return Promise.reject();
    },

    logout(){
        AppStorage.set('logout', true);
        return this.userManager.signoutRedirect();
    },    

    destroy() {
        let me = this;
        me.destroyMembers('userManager', 'user');
        me.callParent();
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