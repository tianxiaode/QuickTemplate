Ext.define('Common.core.service.Config', {
    alternateClassName: 'Config',
    singleton: true,

    requires: [
        'Common.core.service.DocumentVisibility',
        'Common.core.util.Logger',
        'Common.core.service.Alert',
        'Common.core.service.Url',
        'Common.core.service.HttpClient'
    ],

    mixins: [
        'Ext.mixin.Observable',
    ],

    config: {
        clock: null,
        currentUser: null,
        currentTenant: null,
        features: null,
        globalFeatures: null,
        multiTenancy: false,
        setting: null,
        timing: null,
        grantedPolicies: null,
    },

    isReady: false,

    constructor(config) {
        let me = this;
        //me.initConfig(config);
        me.mixins.observable.constructor.call(me, config);
        if (AppConfig.isLogScriptError) {
            window.addEventListener('error', me.onScriptError);
        }
        if (AppConfig.loggerLevel) {
            Logger.setLevel(AppConfig.loggerLevel);
        }

    },

    getAppName() {
        return Ext.getApplication().getName();
    },

    getAuthData() {
        return this.data.auth;
    },

    getPasswordSetting() {
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

    getFileOption(key) {
        let me = this,
            fileOptions = me.getFileOptions();
        return fileOptions[key];
    },

    loadConfiguration() {
        let me = this;
        me.isReady = false;
        let request = Http.get(URI.get('abp', 'application-configuration'), { IncludeLocalizationResources: false });
        request.then(
            me.loadConfigurationSuccess.bind(me),
            Alert.ajax.bind(me, locale.get('loadingUserConfigurationError'))
        );
        return request;
    },

    clearAll() {
        let me = this;
        me.isReady = false;
        me.data = null;
    },

    destroy() {
        let me = this;
        if (AppConfig.isLogScriptError) {
            window.removeEventListener('error', me.onScriptError);
        }
        me.destroyMembers('clock', 'currentUser', 'currentTenant', 'features',
            'globalFeatures', 'grantedPolicies',
            'multiTenancy', 'setting', 'timing');
        me.callParent();
    },

    privates: {

        loadConfigurationSuccess(response) {
            let me = this,
                data = response.request.getJson();
            me.setGrantedPolicies(data.auth.grantedPolicies);
            me.setClock(data.clock);
            me.setCurrentUser(data.currentUser);
            me.setCurrentTenant(data.currentTenant);
            me.setFeatures(data.features);
            me.setGlobalFeatures(data.globalFeatures);
            // me.setCurrentCulture(data.localization.currentCulture);
            // me.setLanguages(data.localization.languages);
            me.setMultiTenancy(data.multiTenancy.isEnabled);
            me.setSetting(data.setting);
            me.setTiming(data.timing);
            // me.setDefaultResourceName(data.localization.defaultResourceName);
            me.isReady = true;
            //Ext.fireEvent('configReady', me);
            Ext.defer(me.fireEvent, 50, me, ['ready', me]);
        },

        onScriptError(event) {
            Http.postScriptError(event.error.message, event.filename, event.lineno, event.colno, event.error.stack);
        }



    }// end privates


});
