Ext.define('Common.core.service.Config', {
    alternateClassName: 'Config',
    singleton: true,

    requires:[
        'Common.core.util.Logger'
    ],

    mixins: [
        'Ext.mixin.Observable',
    ],
    
    config:{
        xsrfCookieName: 'XSRF-TOKEN',
        //xsrfHeaderName: 'X-XSRF-TOKEN',
        xsrfHeaderName: 'RequestVerificationToken',
        oidc: null,
        server: null,
        language: null
    },


    isReady: false,

    constructor(config){
        let me = this,
            appConfig = window.AppConfig;
        me.initConfig(config)
        me.mixins.observable.constructor.call(me, config);
        let configs = me.self.getConfigurator().configs;
        Object.keys(configs).forEach(k=>{
            let value = appConfig[k];
            if(!value) return;
            let cfg = configs[k];
            cfg && cfg.setter.call(me, value);
        });
        if(appConfig.isLogScriptError){
            window.onerror = (msg, url, line, col, error)=>{
                Http.postScriptError(msg, url, line, col, error);
            }
        }
        if(appConfig.loggerLevel){
            Logger.setLevel(appConfig.loggerLevel);
        }
    },

    getAppName(){
        return Ext.getApplication().getName();
    },    

    isAuthenticated(){
        let me = this;
        return me.data.currentUser && me.data.currentUser.id && me.data.user.currentUser > 0;
    },

    getCurrentUser(){
        return this.data.currentUser;
    },

    getAuthData(){
        return this.data.auth;
    },

    getCurrentLanguage(){
        return AppStorage.get('lang') || this.getLanguage();
    },

    getPasswordSetting(){
        let setting = Config.data.setting.values;
        return {
            requiredLength: setting['Abp.Identity.Password.RequiredLength'],
            requireDigit: setting['Abp.Identity.Password.RequireDigit'],
            requireLowercase: setting['Abp.Identity.Password.RequireLowercase'],
            requireUppercase: setting['Abp.Identity.Password.RequireUppercase'],
            requireNonAlphanumeric: setting['Abp.Identity.Password.RequireNonAlphanumeric'],
            requiredUniqueChars: setting['Abp.Identity.Password.RequiredUniqueChars']
        };
    },

    getFileOption(key){
        let me = this,
            fileOptions = me.getFileOptions();
        return fileOptions[key];
    },

    loadConfiguration(){
        let me = this;
        me.isReady = false;
        let request = Http.get(URI.get('application-configuration'));
        request.then(me.loadConfigurationSuccess, Ext.Msg.showAjaxErrors.bind(me, 'LoadConfiguration'), null ,me);
        return request;
    },

    clearAll(){
        let me = this;
        me.isReady = false;
        me.data = null;
    },
    
    destroy() {
        let me = this;
        me.destroyMembers('oAuthConfig', 'data');
        me.callParent();
    },

    privates:{
        data: {},

        loadConfigurationSuccess(response){
            let me = this,
                data = response.request.getJson();
            me.data = Object.assign({}, data);
            me.isReady = true;
            Ext.defer(me.fireEvent, 10, me,  ['ready',me]);
        }
    
    }// end privates


});
