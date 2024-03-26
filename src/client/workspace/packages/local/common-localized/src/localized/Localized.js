Ext.define('Common.localized.Localized', {
    alternateClassName: 'I18N',
    singleton: true,

    requires: [
        'Common.core.service.HttpClient',
        'Common.core.service.Url',
        'Common.core.service.Storage',
        'Common.core.service.Alert'
    ],

    mixins: [
        'Ext.mixin.Observable',
    ],

    config: {
        labelSeparator: '',
        resources: null,
        defaultResourceName: null,
        currentCulture: null,
        languages: null,
    },

    isReady: false,
    languageMap: null,

    constructor(config) {
        let me = this;
        // this.initConfig(config);
        me.mixins.observable.constructor.call(me, config);
    },

    applyCurrentCulture(culture) {
        if(!culture || !culture.cultureName) return this.getCurrentCultureByLanguages();
        return culture;
    },

    updateLanguages(languages) {
        let me = this,
            languageMap = {};
        languages.forEach(language => {
            languageMap[language.cultureName] = language;
        });
    },

    getCurrentLanguage() {
        return AppStorage.get('lang')
    },

    getResourceText(key, resourceName, entityName) {
        let me = this,
            resource = me.getResource(resourceName),
            text;
        if (!resource) return null;
        text = resource[key];
        if (text) return text;
        if (entityName) {
            text = resource[`${entityName}:${key}`]
            if (text) return text;
        }
        text = resource[`DisplayName:${key}`];
        return text ? text : null;
    },

    getDefaultResourceText(key, entityName) {
        return this.getResourceText(key, this.getDefaultResourceName(), entityName);
    },

    getExtResourceText(key, entityName) {
        return this.getResourceText(key, 'ExtResource', entityName);
    },

    get(key, resourceName, entityName) {
        if (Ext.isNumeric(key)) return key;
        resourceName = Format.capitalize(resourceName);
        entityName = Format.capitalize(entityName);
        key = Format.capitalize(key);
        let me = this,
            text;
        if (resourceName) {
            text = me.getResourceText(key, resourceName, entityName);
            if (text) return text;
        }
        text = me.getDefaultResourceText(key, entityName);
        if (text) return text;
        text = me.getExtResourceText(key, entityName);
        return text ? text : key;
    },

    getUnknownError() {
        return I18N.localText.UnknownError[I18N.getCurrentLanguage()];
    },

    getDefaultMessageTitle() {
        return I18N.localText.DefaultInfoTitle[I18N.getCurrentLanguage()];
    },

    getLocalText(key) {
        return I18N.localText[key][I18N.getCurrentLanguage()];
    },

    loadResources(url) {
        let me = this;
        me.isReady = false;
        url = url || URI.get('localization');
        let request = Http.get(url, { cultureName: me.getCurrentLanguage() });
        request.then(me.loadSuccess.bind(me), Alert.ajax.bind(me, I18N.getLocalText('LoadingLocalizedError')));
        return request;
    },

    getResource(name) {
        let resources = this.getResources(),
            resource = resources && resources[name];
        return resource;
    },

    switchLanguage(language) {
        let me = this,
            current = AppStorage.get('lang');
        if (current === language) return;
        AppStorage.set('lang', language);
        me.loadResources();
    },

    destroy() {
        let me = this;
        me.destroyMembers('localText', 'resources', 
            'defaultResourceName', 'languageMap', 'languages');
        me.callParent();
    },

    privates: {
        localText: {
            'LoadingOrganizationUnit': {
                'en': 'Loading the organization...',
                'zh-Hans': '正在加载组织...'
            },
            'DefaultInfoTitle': {
                'en': 'Information',
                'zh-Hans': '信息'
            },
            'NetworkError': {
                'en': 'Network Error!',
                'zh-Hans': '网络错误'
            },
            'UnknownError': {
                'en': 'Unknown error!',
                'zh-Hans': '未知错误'
            },
            'LoadingUserConfiguration': {
                'en': 'Loading the configuration...',
                'zh-Hans': '正在加载用户配置...'
            },
            'LoadingUserConfigurationrror': {
                'en': 'Failed to load configuration',
                'zh-Hans': '加载用户配置失败，请与管理员联系'
            },
            'LoadingLocalized': {
                'en': 'Loading localized text...',
                'zh-Hans': '正在加载本地化文本...'
            },
            'LoadingLocalizedError': {
                'en': 'Failed to load localized text',
                'zh-Hans': '加载本地化文本失败'
            },
            'WaitSwitch': {
                'en': 'Wait for the last organizational switch before switching.',
                'zh-Hans': '请等待上一次组织切换以后再进行切换'
            }
        },

        doOverride() {
            let me = this,
                localizeMonthNames = [],
                localizeDayNames = [],
                am = me.getResourceText('AM') || 'AM',
                pm = me.getResourceText('PM') || 'PM';

            if (Ext.util && Ext.util.Format) {
                Ext.util.Format.defaultDateFormat = me.getExtResourceText('DefaultDateFormat');
                Ext.util.Format.defaultDateTimeFormat = me.getExtResourceText('DefaultDateTimeFormat');
                Ext.util.Format.currencySign = me.getExtResourceText('CurrencySign');
            }

            if (!Ext.Date.originMonthNames) {
                Ext.Date.originMonthNames = [...Ext.Date.monthNames];
            }

            Ext.each(Ext.Date.originMonthNames, month => {
                localizeMonthNames.push(me.getExtResourceText(month) || month);
            });

            Ext.Date.monthNames = localizeMonthNames;

            if (!Ext.Date.originDayNames) {
                Ext.Date.originDayNames = [...Ext.Date.dayNames];
            }

            Ext.each(Ext.Date.originDayNames, day => {
                localizeDayNames.push(me.getExtResourceText(day) || day);
            });

            Ext.Date.dayNames = localizeDayNames;

            Ext.Date.formatCodes.a = `(this.getHours() < 12 ? '${am}' : '${pm}')`;
            Ext.Date.formatCodes.A = `(this.getHours() < 12 ? '${am}' : '${pm}')`;

            let parseCodes = {
                g: 1,
                c: "if (/(" + am + ")/i.test(results[{0}])) {\n" +
                    "if (!h || h == 12) { h = 0; }\n" +
                    "} else { if (!h || h < 12) { h = (h || 0) + 12; }}",
                s: `(${am}|${pm})`,
                calcAtEnd: true
            };

            Ext.Date.parseCodes.a = Ext.Date.parseCodes.A = parseCodes;


        },
    },


    loadSuccess(response) {
        let me = this,
            data = response.request.getJson();
        if (!data) return;
        me.setResources(data.values);
        me.setDefaultResourceName(data.defaultResourceName);
        me.setCurrentCulture(data.currentCulture);
        me.setLanguages(data.languages);
        me.doOverride();
        me.setLabelSeparator(me.getExtResourceText('LabelSeparator'));
        me.isReady = true;
        //Ext.fireEvent('localizedReady', me);
        Ext.defer(me.fireEvent, 50, me, ['ready', me])
    },

    getCurrentCultureByLanguages() {
        let currentLanguage = me.getCurrentLanguage();
        if(currentLanguage === 'zh-CN') currentLanguage = 'zh-Hans';
        if(currentLanguage === 'zh-TW') currentLanguage = 'zh-Hant';
        return this.languageMap[currentLanguage];
    },



})
