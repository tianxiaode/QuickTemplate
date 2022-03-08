# Localization of Ext JS using Json (Modern)

## Why?

In one project, the [Abp Framework](https://www.abp.io/) development platform was used. Each module of the framework comes with its own localization resources, and the client can download all the localization resources through json. If you use the default way of `Ext Js` to achieve localization, you have to manage and maintain two localized resources, so using this Json file directly in `Ext Js` is the easiest way to localize.

## How?

In `Ext Js`, localization is achieved by rewriting, and to switch to using the Json method for localization, there are several key points:
* Get the corresponding text on the resource segment corresponding to json by `key`
* Ensure that the `key` is not contaminated and can be reused
* Can dynamically switch localized text after switching languages
* Revamp the original localized text of `Ext Js` so that it can obtain localized text from Json

After studying the article [Internationalization & Localization with Sencha Ext JS](https://www.sencha.com/blog/internationalization-localization-with-sencha-ext-js/), I finally have a specific implementation idea:

* Add the `resourceName` property to the `class` to specify the resource segment
* Add an property prefixed with `lng` for `class` as the `key` of the language text, for example, the `Ext.Component` class, which records the displayed text through the `html` property, you can add `lngHtml` to record the `key` of the language text
* Create a localized class alias `I18N` whose main features include:
  * Load json and trigger the language file load event (`i18nready`)
  * Provides a provider to get the language text from json based on the provided `key` and `resourceName`
  * Language switching function more
* Rewrite the `Ext.Component` class to bind the `i18nready` event to all component classes, adding an `onLocalized` method to refresh the display
Rewrite non-derived `Ext.Component` classes, bind the `i18nready` event to them, and add an `onLocalized` method to refresh the display
* Defining `resourceName` for each component is a hassle, whereas a common scenario is that components within a container use the same `resourceName`, so these components can get `resourceName` from the container. Since there may be many layers of containers in a view, the easiest and most straightforward way to filter out containers with `resourceName` is to add the `includeResource` property to these containers, and if the value is `true`, it means that the container has `resourceName`.

### Json格式
```json
{
    "Values":{
        "ExtResource":{
            //Localized resources for Ext Js
        },
        "ResourceName1":{
            //Language text
        },
        "ResourceName2":{
            //Language text
        },
        // More resource segments
    },
    // A list of languages for the project
    "languages": [
        {
            "cultureName": "en",
            "uiCultureName": "en",
            "displayName": "English (United States)",
            "flagIcon": "gb"
        },
        {
            "cultureName": "zh-Hans",
            "uiCultureName": "zh-Hans",
            "displayName": "简体中文",
            "flagIcon": "cn"
        },
        {
            "cultureName": "zh-Hant",
            "uiCultureName": "zh-Hant",
            "displayName": "繁體中文",
            "flagIcon": "cn"
        }
    ],
    //The current language
    "currentCulture": {
        "displayName": "中文(简体)",
        "englishName": "Chinese (Simplified)",
        "threeLetterIsoLanguageName": "zho",
        "twoLetterIsoLanguageName": "zh",
        "isRightToLeft": false,
        "cultureName": "zh-Hans",
        "name": "zh-Hans",
        "nativeName": "中文(简体)",
        "dateTimeFormat": {
            "calendarAlgorithmType": "SolarCalendar",
            "dateTimeFormatLong": "yyyy'年'M'月'd'日'",
            "shortDatePattern": "yyyy/M/d",
            "fullDateTimePattern": "yyyy'年'M'月'd'日' H:mm:ss",
            "dateSeparator": "/",
            "shortTimePattern": "H:mm",
            "longTimePattern": "H:mm:ss"
        }
    },
    //The default language segment
    "defaultResourceName": "Service",
    "languagesMap": {},
    "languageFilesMap": {}
}
```

In order to add the localization resources that Ext Js already has in the [Abp framework](https://www.abp.io/), I implemented a module called [`extresource`](https://github.com/tianxiaode/GenericAbp/tree/master/src/modules/extresource/src). The module will add a resource segment with `key` as `ExtResource` in the `Values` of the above Json.

With `languages` in json, a drop-down menu can be implemented to switch languages.

With `currentCulture` in json, the localization of date formats can be achieved.

### Class `I18N`

```javascript
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
        let current = StorageService.get('lang') || navigator.language;
        me.setCurrentLanguage(current);
        StorageService.set('lang', current);
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
        const me = this, 
            current = me.getCurrentLanguage();
        if(current === value) return;
        me.setCurrentLanguage(value);
        StorageService.set('lang', value);
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
        Http.get(URI.getResource(me.getCurrentLanguage()))
            .then(me.loadSuccess,Failure.ajax, null, me);
    },

    loadSuccess(response){
        const me = this,
            obj = Http.praseResponseText(response);
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

```

In the `initLanguages` method, the saved language is first fetched from `LocalStorage` and, if it does not exist, the browser's default language is used as the default language. Finally, call the `loadResources` method to load json.

After the load is complete, save the load data to the `remoteRawValue` property and call the `doOverride` method to update the date format.

In the `get` method, the language text is first taken from `resourceName`, if it does not exist, it is taken from the default resource segment, if it does not exist, it is taken from the `ExtResource` resource segment, and if it does not already exist, it is returned directly `key`.

### Override `Ext.Component`

```javascript
Ext.define('Common.overrides.shared.Component',{
    override: 'Ext.Component',

    config:{
        langHtml: null,
        langTooltip: null
    },

    initialize(){
        let me = this;
        me.callParent(arguments);
        if(I18N && I18N.isReady){
            me.onLocalized();
        }
        Ext.on('i18nready', me.onLocalized, me);
    },

    onLocalized(){
        let me = this,
            resourceName = me.resourceName || me.getContainerResourceName(),
            html = me.getLangHtml(),
            langTooltip = me.getLangTooltip(),
            text = '';
        if(langTooltip){
            if(Ext.isArray(langTooltip)){
                langTooltip.forEach(t=>{
                    text += I18N.get(t, resourceName)
                })
            }else{
                text =  I18N.get(langTooltip, resourceName)
            }
            me.setTooltip(text);
        }
        if(!html) return;
        text = '';
        if(Ext.isArray(html)){
            text = me.getArrayText(html, true, resourceName);
            me.setHtml(text);
            return;
        }
        text = I18N.get(html, resourceName);
        if(Ext.isArray(text)) text = me.getArrayText(text , false);
        me.setHtml(text);
        

    },

    getContainerResourceName(){
        let me = this;
        let container = me.includeResource ? me : me.up('[includeResource]'),
            vm = container && container.getViewModel();
        
        return (vm && vm.get('resourceName')) || (container && container.resourceName);

    },

    getEntityName(){
        let me = this;
        if(me.entityName) return me.entityName;
        let container = me.up && me.up('[includeResource]');
            vm = container && container.getViewModel();
        return (vm && vm.get('entityName')) || (container && container.entityName);
    },

    getArrayText(text, needLocalized,resourceName){
        let html = [];
        text.forEach(t=>{
            html.push(needLocalized ? I18N.get(t, resourceName) : t);
        })
        return html.join('');
    },


})
```

In the `initialize` method, if the language text is loaded, the `onLocalized` method is called directly to refresh the display. Regardless of whether the language text is loaded or not, the `i18nready` event needs to be bound to implement dynamic language switching.

In the `onLocalized` method, the `get` method of `I18N` is called to get the language text based on the values of `lngHtml` and `lngTooltip`, and then refresh the display.

The purpose of the method `getContainerResourceName` is to get `resourceName` by searching up the container. Defining `resourceName` in the view model is also a good idea, so the code to get `resourceName` from the view model is also added to the method.

### Others

Buttons use the `text` attribute to define the display text, so the button `onLocalized` method needs to be overridden.

In addition to buttons, there are some classes such as `LoadMask`, `Panel`, and `Validator` that need to be overridden.

### Language toggle button

```javascript
Ext.define('Common.shared.ux.button.Language',{
    extend: 'Ext.Button',
    xtype: 'languagebutton',

    ui: 'action',

    onLocalized(){
        const me = this,
            current = I18N.getCurrentCulture(),
            displayName = current.cultureName.includes('zh') ? current.displayName: current.englishName;
        me.setLangText(displayName);
        me.callParent();
        if(me.getMenu()) return;
        const menus = [];
        I18N.getLanguages().forEach(l=>{
            menus.push({ 
                value: l.cultureName , 
                langText: l.displayName, 
                handler: me.onSwitchLanguage,
            });
        });
        me.setMenu(menus);
        
    },


    onSwitchLanguage(sender){
        I18N.switchLanguages(sender.value);
    }

})
```


