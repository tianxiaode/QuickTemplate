Ext.define('Common.shared.service.Localized', {
    alternateClassName: 'I18N',
    singleton: true,

    config:{
        currentLanguage: null,
        labelSeparator: '',
    },

    requires:[
        'Common.shared.util.Url',
        'Common.shared.util.Failure',
        'Common.shared.service.Storage',
    ],
  
    isReady: false,

    constructor(config){
        const me = this;        
        me.initConfig(config)
        me.initLanguages();
    },

    initLanguages(){
        const me = this;
        let current = StorageService.get('lang');
        if(!current) {
            current = AppConfig.lang === 'zh-CN' ? 'zh-Hans' 
            : AppConfig.lang === 'zh-TW' ? 'zh-Hant' : AppConfig.lang;
        }
        me.setCurrentLanguage(current);
        StorageService.set('lang', current);
        me.loadResources();
    },

    get(key, resourceName){
        const me = this,
            defaultResourceName = me.remoteRawValue.defaultResourceName,
            values = me.remoteRawValue.values;
        return resourceName && values[resourceName] && values[resourceName][key] 
            || ( values && values['ExtResource'] && values['ExtResource'][key] )
            || ( values && values[defaultResourceName] && values[defaultResourceName][key] )
            || key;
    },

    getLanguages(){
        return this.remoteRawValue.languages;
    },

    getCurrentCulture(){
        return this.remoteRawValue.currentCulture;
    },

    switchLanguages(value){
        const me = this, 
            current = me.getCurrentLanguage();
        if(current === value) return;
        me.setCurrentLanguage(value);
        StorageService.set('lang', value);
        me.loadResources();
    },

    // localized(cls, name,  resourceName){
    //     name = Ext.String.capitalize(name);
    //     const me = this,
    //         originLocalized = cls.getOriginLocalized(),
    //         hasLabelSeparator = me.getCurrentLanguage() === 'zh-Hans' && name === 'Label',
    //         labelSeparator  = hasLabelSeparator ? me.getLabelSeparator() : '',
    //         get = cls[`get${name}`],
    //         set = cls[`set${name}`];
    //     let value =  originLocalized[name];
    //     //有原始值的，使用原始值返回
    //     if(value){
    //         if(set){
    //             let returnValue = I18N.get(value,resourceName) + labelSeparator;
    //             if(name === 'Tooltip') returnValue = { html: returnValue};
    //             set.apply(cls, [returnValue]);
    //             return;
    //         }
    //         return I18N.get(value,resourceName);
    //     }
    //     //没有原始值的处理
    //     if(!get || !set) {
    //         //没有set或get方法的，直接返回
    //         value = name;
    //         originLocalized[name] = value;
    //         return I18N.get(value,resourceName);
    //     };
    //     value = get.apply(cls);
    //     if(!value) return;
    //     originLocalized[name] = name === 'Tooltip' ? value.html : value;        
    //     let returnValue = I18N.get(originLocalized[name],resourceName) + labelSeparator;
    //     if(name === 'Tooltip') returnValue = { html: returnValue};
    //     set.apply(cls, [returnValue]);
    // },
    
    getUnknownError(){
        return this.localText.UnknownError[this.getCurrentLanguage()];
    },

    getDefaultMessageTitle(){
        return this.localText.DefaultInfoTitle[this.getCurrentLanguage()];
    },

    getLocalText(key){
        return this.localText[key][this.getCurrentLanguage()];
    },
    
    privates:{
        remoteRawValue: {},
        localText:{
            'LoadingOrganizationUnit':{
                'en': 'Loading the organization...',
                'zh-Hans': '正在加载组织...'
            },
            'DefaultInfoTitle':{
                'en': 'Information',
                'zh-Hans': '信息'
            },
            'UnknownError':{
                'en': 'Unknown error!',
                'zh-Hans': '未知错误'
            },
            'LoginOrganizationUnit':{
                'en': 'Signing in to the organization.!',
                'zh-Hans': '正在登录组织'
            },
            'OrganizationUnitNotExist':{
                'en': 'The organization does not exist.',
                'zh-Hans': '组织不存在'
            },
            'LoadingUserConfiguration':{
                'en': 'Loading the configuration...',
                'zh-Hans': '正在加载用户配置...'
            },
            'Error401':{
                'en': 'There is no permission to do this.',
                'zh-Hans': '没有权限执行此操作.'
            },
            'WaitSwitch':{
                'en': 'Wait for the last organizational switch before switching.',
                'zh-Hans': '请等待上一次组织切换以后再进行切换'
            }
        },
    
        doOverride(){
            const me = this,
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

            if(!Ext.Date.originMonthNames)Ext.Date.originMonthNames = [].concat(Ext.Date.monthNames);
            Ext.Date.originMonthNames.forEach(month=>{
                newMonthNames.push(values[month] || month);

            });
            Ext.Date.monthNames = newMonthNames;

            if(!Ext.Date.originDayNames)Ext.Date.originDayNames = [].concat(Ext.Date.dayNames);
            Ext.Date.originDayNames.forEach(day=>{
                newDayNames.push(values[day] || day);

            });
            Ext.Date.dayNames = newDayNames;

            //console.log(Ext.Date)
            Ext.Date.formatCodes.a = `(this.getHours() < 12 ? '${am}' : '${pm}')`;
            Ext.Date.formatCodes.A = `(this.getHours() < 12 ? '${am}' : '${pm}')`;
    
            const parseCodes = {
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

    loadResources(){
        const me= this;
        me.isReady = false;
        Ext.Ajax.request({
            url: URI.getResource(me.getCurrentLanguage()),
            headers: {
                'Authorization' : 'Bearer ' +  StorageService.get('access_token'),
                //'Access-Control-Allow-Origin': '*',
                "accept-language": StorageService.get('lang')                
            },
            scope: me
        }).then(me.loadSuccess,Failure.ajax, null, me);
    },

    loadSuccess(response){
        const me = this,
            obj = Ext.decode(response.responseText,true);        
        if(obj){
            
            me.remoteRawValue = Object.assign({}, obj);
            me.doOverride();
            if(obj.values && obj.values.ExtResource){
                me.setLabelSeparator(obj.values.ExtResource.LabelSeparator);
            }
        }
        me.isReady = true;
        Ext.fireEvent('i18nready', me);

    },


})
