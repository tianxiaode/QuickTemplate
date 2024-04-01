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
        return window.locale.get(key);
    },

    loadResources(url) {
        let me = this;
        me.isReady = false;
        url = url || URI.get('localization');
        let request = Http.get(url, { cultureName: me.getCurrentLanguage() });
        request.then(
            me.loadSuccess.bind(me), 
            Alert.ajax.bind(me, locale.get('loadingLocalizedError')));
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
        me.destroyMembers('resources', 'defaultResourceName', 'languageMap', 'languages');
        me.callParent();
    },

    privates: {
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
        
        let extResource = me.getResource('ExtResource');
        extResource['ConfirmMessageTitle'] = "确认要对以下数据执行{0}操作？";
        extResource['ConfirmMessageWarning'] = "注意：部分数据可能因条件限制{0}不了！";
        extResource["Deleting"] = "正在删除，请稍候...";
        extResource["DeleteSuccessMessage"] = "数据已删除";
        extResource["DeleteErrorMessage"] = "删除数据时发生错误，请稍后再试。";
        extResource["DeleteConfirmMessage"] = "确认要删除所选的数据？";
        extResource["DeleteWarningMessage"] = "注意：部分数据可能因条件限制删除不了！";
        extResource["Export"] = "导出";
        extResource["Exporting"] = "正在导出CSV文件，请稍候...";
        extResource["ExportSelected"] = "导出所选";
        extResource["ExportSearch"] = "导出查询结果";
        extResource["ExportAll"] = "导出全部";
        extResource["ExportingPdf"] = "正在导出PDF, 请稍候...";
        extResource["ExportingExcel"] = "正在导出Excel文件，请稍候...";
        extResource["ExportingCsv"] = "正在导出CSV文件，请稍候...";
        extResource["ConfirmExportSelectedToExcel"] = "确定将所选数据导出为Excel文件？";
        extResource["ConfirmExportSearchToExcel"] = "确定将查询结果导出为Excel文件？";
        extResource["ConfirmExportAllToExcel"] = "确定将全部数据导出为Excel文件？";
        extResource["ConfirmExportSelectedToCsv"] = "确定将所选数据导出为CSV文件？";
        extResource["ConfirmExportSearchToCsv"] = "确定将查询结果导出为CSV文件？";
        extResource["ConfirmExportAllToCsv"] = "确定将全部数据导出为CSV文件？";
        extResource["ConfirmExportSelectedToPdf"] = "确定将所选数据导出为PDF文件？";
        extResource["ConfirmExportSearchToPdf"] = "确定将查询结果导出为PDF文件？";
        extResource["ConfirmExportAllToPdf"] = "确定将全部数据导出为PDF文件？";
        extResource["ExportSuccessMessage"] = "数据已导出";
        extResource["ExportErrorMessage"] = "导出数据时发生错误，请稍后再试。";
        extResource["ExportExcel"] = "导出Excel";
        extResource["ExportExcelMessage"] = "正在导出Excel文件，请稍候...";
        extResource["ExportExcelSuccessMessage"] = "Excel文件已导出";
        extResource["ExportExcelErrorMessage"] = "导出Excel文件时发生错误，请稍后再试。";
        extResource["AsyncExportSuccessMessage"] = "导出请求已收到，文件生成后会以消息的形式通知您，请根据信息下载文件。";
        extResource["AsyncExportErrorMessage"] = "导出请求失败，请稍后再试。";
    

        me.isReady = true;
        Ext.defer(me.fireEvent, 50, me, ['ready', me])
    },

    getCurrentCultureByLanguages() {
        let currentLanguage = me.getCurrentLanguage();
        if(currentLanguage === 'zh-CN') currentLanguage = 'zh-Hans';
        if(currentLanguage === 'zh-TW') currentLanguage = 'zh-Hant';
        return this.languageMap[currentLanguage];
    },



})
