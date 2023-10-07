Ext.define('Common.localized.Localized', {
    alternateClassName: 'I18N',
    singleton: true,

    requires:[
        'Common.core.service.Storage'
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
        me.initLanguages();
        me.mixins.observable.constructor.call(me, config);
    },

    initLanguages() {
        let me = this;
        let current = AppStorage.get('lang');
        if (!current) {
            current = AppConfig.lang === 'zh-CN' ? 'zh-Hans'
                : AppConfig.lang === 'zh-TW' ? 'zh-Hant' : AppConfig.lang;
        }
        me.setCurrentLanguage(current);
        AppStorage.set('lang', current);
    },

    getDefaultResourceName() {
        return I18N.remoteRawValue.defaultResourceName;
    },

    get(key, resourceName, entityName) {
        resourceName = Format.capitalize(resourceName);
        entityName = Format.capitalize(entityName);
        key = Format.capitalize(key);
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
        if (defaultResource.hasOwnProperty(key)) return defaultResource[key];
        if (extResource.hasOwnProperty(entityKey)) return extResource[entityKey];
        if (defaultResource.hasOwnProperty(entityKey)) return defaultResource[entityKey];
        if (extResource.hasOwnProperty(displayNameKey)) return extResource[displayNameKey];
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
        let me = this,
            defferrd = new Ext.Deferred();
        me.isReady = false;
        url = url || URI.get('localization');
        Http.get(url).then(
            (response) => {
                me.loadSuccess(response);
                defferrd.resolve(response);
            },
            (response) => {
                defferrd.reject(response);
            },
        );
        return defferrd.promise;
    },

    destroy() {
        let me = this;
        me.destroyMembers('remoteRawValue', 'localText', 'languageMap');
        me.callParent();
    },

    privates: {
        remoteRawValue: {},
        localText: {
            'LoadingOrganizationUnit': {
                'en': 'Loading the organization...',
                'zh-Hans': '正在加载组织...'
            },
            'DefaultInfoTitle': {
                'en': 'Information',
                'zh-Hans': '信息'
            },
            'UnknownError': {
                'en': 'Unknown error!',
                'zh-Hans': '未知错误'
            },
            'LoadingUserConfiguration': {
                'en': 'Loading the configuration...',
                'zh-Hans': '正在加载用户配置...'
            },
            'LoadingLocalized': {
                'en': 'Loading localized text...',
                'zh-Hans': '正在加载本地化文本...'
            },
            'Error401': {
                'en': 'There is no permission to do this.',
                'zh-Hans': '没有权限执行此操作.'
            },
            'Error404': {
                'en': 'The requested resource is not avail.',
                'zh-Hans': '请求的资源不可用.'
            },
            'Error405': {
                'en': 'Method Not Allowed.',
                'zh-Hans': '方法不被允许.'
            },
            'Error415': {
                'en': 'Unsupported Media Type.',
                'zh-Hans': '不支持的媒体类型.'
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
            data = response.getJson(),
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
