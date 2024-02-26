Ext.define('Common.localized.Localized', {
    alternateClassName: 'I18N',
    singleton: true,

    requires:[
        'Common.core.service.HttpClient',
        'Common.core.service.Url',
        'Common.core.service.Storage',
        'Common.core.service.Alert'
    ],

    mixins: [
        'Ext.mixin.Observable',
    ],

    config: {
        currentLanguage: null,
        labelSeparator: '',
    },

    isReady: false,
    languageMap: null,

    constructor(config) {
        let me = this;
        me.initConfig(config)
        me.setCurrentLanguage(AppStorage.get('lang'));
        me.mixins.observable.constructor.call(me, config);
    },

    getDefaultResourceName() {
        return I18N.remoteRawValue.defaultResourceName;
    },

    get(key, resourceName, entityName) {
        if(Ext.isNumeric(key)) return key;
        resourceName = Format.capitalize(resourceName);
        entityName = Format.capitalize(entityName);
        key = Format.capitalize(key);
        Logger.debug(this.get, key, entityName, resourceName)
        let me = this,
            defaultResourceName = me.remoteRawValue.defaultResourceName,
            values = me.remoteRawValue.values;
        if (!values) return;
        let extResource = values['ExtResource'] || {},
            defaultResource = values[defaultResourceName],
            displayNameKey = `DisplayName:${key}`,
            entityKey = `${entityName}:${key}`;
        if (resourceName) {
            let resource = values[resourceName];
            if (resource) {
                if (resource.hasOwnProperty(key)) return resource[key];
                if (resource.hasOwnProperty(entityKey)) return resource[entityKey];
                if (resource.hasOwnProperty(displayNameKey)) return resource[displayNameKey];
            }
        }
        if (extResource.hasOwnProperty(key)) return extResource[key];
        if (extResource.hasOwnProperty(entityKey)) return extResource[entityKey];
        if (extResource.hasOwnProperty(displayNameKey)) return extResource[displayNameKey];

        if(!defaultResource) return key;
        if (defaultResource.hasOwnProperty(key)) return defaultResource[key];
        if (defaultResource.hasOwnProperty(entityKey)) return defaultResource[entityKey];
        if (defaultResource.hasOwnProperty(displayNameKey)) return defaultResource[displayNameKey];
        return key;
    },

    getLanguage(cultureName) {
        let value = I18N.languageMap && I18N.languageMap[cultureName];
        return value;
    },

    getLanguages() {
        return I18N.remoteRawValue.languages;
    },

    getCurrentCulture() {
        return I18N.remoteRawValue.currentCulture;
    },

    switchLanguages(value) {
        let me = this,
            current = me.getCurrentLanguage();
        if (current === value) return;
        me.setCurrentLanguage(value);
        AppStorage.set('lang', value);
        me.loadResources();
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

    getResourceName() {
        return Object.keys(I18N.remoteRawValue.values);
    },

    loadResources(url) {
        let me = this;
        me.isReady = false;
        url = url || URI.get('localization');
        let request = Http.get(url);
        request.then(me.loadSuccess.bind(me), Alert.ajax.bind(me,I18N.getLocalText('LoadingLocalizedError')));
        return request;
    },

    destroy() {
        let me = this;
        me.destroyMembers('remoteRawValue', 'localText', 'languageMap');
        me.callParent();
    },

    privates: {
        remoteRawValue: {},
        localText: {
            applicationUpdate: {
                "en": 'Application Update',
                "zh-CN": '更新应用程序'
            },
            applicationUpdateMessage:{
                "en": 'This application has an update, reload?',
                "zh-CN": '应用程序已更新，是否重新加载？'
            },
            'LoadingOrganizationUnit': {
                'en': 'Loading the organization...',
                'zh-Hans': '正在加载组织...'
            },
            'DefaultInfoTitle': {
                'en': 'Information',
                'zh-Hans': '信息'
            },
            'NetworkError':{
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
            'LoadingLocalizedError':{
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
                values = me.remoteRawValue.values.ExtResource,
                newMonthNames = [],
                newDayNames = [],
                am = values['AM'] || 'AM',
                pm = values['PM'] || 'PM';
            if (Ext.util && Ext.util.Format) {
                Ext.util.Format.defaultDateFormat = values.DefaultDateFormat;
                Ext.util.Format.defaultDateTimeFormat = values.DefaultDateTimeFormat;
                Ext.util.Format.currencySign = values.CurrencySign;
            }

            if (!Ext.Date.originMonthNames) Ext.Date.originMonthNames = [].concat(Ext.Date.monthNames);
            Ext.Date.originMonthNames.forEach(month => {
                newMonthNames.push(values[month] || month);

            });
            Ext.Date.monthNames = newMonthNames;

            if (!Ext.Date.originDayNames) Ext.Date.originDayNames = [].concat(Ext.Date.dayNames);
            Ext.Date.originDayNames.forEach(day => {
                newDayNames.push(values[day] || day);

            });
            Ext.Date.dayNames = newDayNames;

            //console.log(Ext.Date)
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
            data = response.request.getJson(),
            map;
        if (!data) return;
        me.remoteRawValue = Object.assign({}, data);
        me.doOverride();
        if (data.values && data.values.ExtResource) {
            me.setLabelSeparator(data.values.ExtResource.LabelSeparator);
        }
        map = me.languageMap = {};
        if (data.languages) {
            Ext.each(data.languages, l => {
                map[l.cultureName] = l;
            })
        }
        me.isReady = true;
        Ext.defer(me.fireEvent, 10, me, ['ready', me]);
    }


})
