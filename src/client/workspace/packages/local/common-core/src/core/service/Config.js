Ext.define('Common.core.service.Config', {
    alternateClassName: 'Config',
    singleton: true,

    requires:[
        'Common.core.util.Logger'
    ],

    mixins: [
        'Ext.mixin.Observable',
    ],
    

    isReady: false,

    constructor(config){
        let me = this;
        me.initConfig(config)
        me.mixins.observable.constructor.call(me, config);
        if(AppConfig.isLogScriptError){
            window.addEventListener('error', me.onScriptError);
        }
        if(AppConfig.loggerLevel){
            Logger.setLevel(AppConfig.loggerLevel);
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
        let locale  = window.location.href.match(/lang=([\w-]+)/),
        currentLang = navigator.language || navigator.browserLanguage;
        return (locale && locale[1]) || currentLang;
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
        if(AppConfig.isLogScriptError){
            window.removeEventListener('error', me.onScriptError);
        }
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
        },

        onScriptError(event){
            Http.postScriptError(event.error.message, event.filename, event.lineno, event.colno, event.error.stack);
        }

    
    }// end privates


});
