Ext.define('Common.service.Localized', {
    alternateClassName: 'I18N',
    singleton: true,

    mixins:[
        'Ext.mixin.Observable'
    ],

    config:{
        currentLanguage: null,
        labelSeparator: '',
    },

    isReady: false,

    constructor(config){
        let me = this;        
        me.initConfig(config)
        me.initLanguages();
    },

    initLanguages(){
        let me = this;
        let current = AppStorage.get('lang');
        if(!current) {
            current = AppConfig.lang === 'zh-CN' ? 'zh-Hans' 
            : AppConfig.lang === 'zh-TW' ? 'zh-Hant' : AppConfig.lang;
        }
        me.setCurrentLanguage(current);
        AppStorage.set('lang', current);
        me.loadResources();
    },
    
    get(key, resourceName, entityName){
        resourceName = Format.capitalize(resourceName);
        entityName = Format.capitalize(entityName);
        key = Format.capitalize(key);
        let me = this,
            defaultResourceName = me.remoteRawValue.defaultResourceName,
            values = me.remoteRawValue.values;
        if(!values) return;
        let extResource = values['ExtResource'] || {},
            defaultResource = values[defaultResourceName] ,  
            displayNameKey = `DisplayName:${key}`,
            entityKey = `${entityName}.${key}`;
        if(resourceName){
            let resource = values[resourceName];  
            if(resource){
                if(resource.hasOwnProperty(key)) return resource[key];
                if(resource.hasOwnProperty(entityKey)) return resource[entityKey];
                if(resource.hasOwnProperty(displayNameKey)) return resource[displayNameKey];    
            }
        }
        if(extResource.hasOwnProperty(key)) return extResource[key];
        if(defaultResource.hasOwnProperty(key)) return defaultResource[key];
        if(extResource.hasOwnProperty(entityKey)) return extResource[entityKey];
        if(defaultResource.hasOwnProperty(entityKey)) return defaultResource[entityKey];
        if(extResource.hasOwnProperty(displayNameKey)) return extResource[displayNameKey];
        if(defaultResource.hasOwnProperty(displayNameKey)) return defaultResource[displayNameKey];
        return key;
    },

    getLanguages(){
        return this.remoteRawValue.languages;
    },

    getCurrentCulture(){
        return this.remoteRawValue.currentCulture;
    },

    switchLanguages(value){
        let me = this, 
            current = me.getCurrentLanguage();
        if(current === value) return;
        me.setCurrentLanguage(value);
        AppStorage.set('lang', value);
        me.loadResources();
    },

    getUnknownError(){
        return this.localText.UnknownError[this.getCurrentLanguage()];
    },

    getDefaultMessageTitle(){
        return this.localText.DefaultInfoTitle[this.getCurrentLanguage()];
    },

    getLocalText(key){
        return this.localText[key][this.getCurrentLanguage()];
    },

    getResourceName(){
        return Object.keys(this.remoteRawValue.values);
    },
    
    loadResources(){
        let me= this;
        me.isReady = false;
        let promise =Http.get(URI.get('localization' ));
        promise.then(me.loadSuccess, me.loadFailure, null, me);
        return promise;
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
                'zh-Hans': '组织不存在?'
            },
            'LoadingUserConfiguration':{
                'en': 'Loading the configuration...',
                'zh-Hans': '正在加载用户配置...'
            },
            'Error401':{
                'en': 'There is no permission to do this.',
                'zh-Hans': '没有权限执行此操作.'
            },
            'Error404':{
                'en': 'The requested resource is not avail.',
                'zh-Hans': '请求的资源不可用.'
            },
            'Error405':{
                'en': 'Method Not Allowed.',
                'zh-Hans': '方法不被允许.'
            },
            'Error415':{
                'en': 'Unsupported Media Type.',
                'zh-Hans': '不支持的媒体类型.'
            },
            'WaitSwitch':{
                'en': 'Wait for the last organizational switch before switching.',
                'zh-Hans': '请等待上一次组织切换以后再进行切换'
            }
        },
    
        doOverride(){
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


    loadSuccess(response){
        let me = this,
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

    loadFailure(response){
        let obj  = Ext.decode(response.responseText, true),
            error = me.getUnknownError();
        if(obj && obj.error) {
            if(Ext.isString(obj.error)){
                error = obj.error_description;
            }else{
                error = obj.error.message;
                if(!Ext.isEmpty(obj.error.code)) error += `[${obj.error.code}]`;
                if(!Ext.isEmpty(obj.error.details)) 
                    error += `[${obj.error.code}]${service && service.getLabelSeparator() || ':'}${obj.error.details}`;
                MsgBox.alert(title, error);
                return error;    
            }
            
        }

    }

})
