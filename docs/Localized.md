# 使用Json实现Ext JS的本地化（Modern）

## 为什么?

在某个项目中，使用了[Abp框架](https://www.abp.io/)开发平台。该框架每一个模块都带有自己的本地化资源，客户端可通过json方式下载全部的本地化资源。如果使用`Ext Js`的习惯方式来实现本地化，那就得管理和维护两份本地化资源，因此，在`Ext Js`中直接使用这个Json文件实现本地化成为最简捷的方式。

## 如何实现

在`Ext Js`中，是通过重写方式来实现本地化的，要切换为使用Josn方式实现本地化，有以下几个要点：
* 通过`key`在json对应的资源段上获取对应的文本
* 保证`key`不被污染，能重复使用
* 在切换语言后，能动态切换本地化文本
* 改造`Ext Js`中原有的本地化文本，使它能从Json中获取本地化文本

在研究过[Internationalization & Localization with Sencha Ext JS](https://www.sencha.com/blog/internationalization-localization-with-sencha-ext-js/)一文后，终于有了具体的实现思路：

* 为`类`添加`resourceName`属性来指定资源段
* 为`类`添加以`lng`为前缀的属性来作为语言文本的`key`，例如`Ext.Component`类，是通过`html`属性来记录显示文本的，可以添加`lngHtml`来记录语言文本的`key`
* 建立一个别名为`I18N`的本地化类，该类的主要功能包括：
  * 加载json，并触发语言文件已加载事件(`i18nready`)
  * 提供访问接口根据提供的`key`和`resourceName`从json中获取语言文本
  * 语言切换功能更
* 重写`Ext.Component`类，为所有组件类绑定`i18nready`事件，添加`onLocalized`方法来刷新显示
* 重写非派生于`Ext.Component`类，为他们绑定`i18nready`事件，添加`onLocalized`方法来刷新显示
* 为每一个组件都定义`resourceName`是一个比较麻烦的事情，而常见的情景是在一个容器内的组件使用的会是同一个`resourceName`，因而，这些组件可从容器中获取`resourceName`。由于一个视图中可能套了很多层的容器，为了能方便筛选出带有`resourceName`的容器，最简单和直接的方法是为这些容器添加`includeResource`属性，值为`true`时，表示该容器带有`resourceName`。

### Json格式
```json
{
    "Values":{
        "ExtResource":{
            //Ext Js的本地化文本
        },
        "ResourceName1":{
            //语言文本
        },
        "ResourceName2":{
            //语言文本
        },
        // 更多的资源段
    },
    // 项目的语言列表
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
    //当前语言
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
    //默认语言段
    "defaultResourceName": "Service",
    "languagesMap": {},
    "languageFilesMap": {}
}
```

为了在[Abp框架](https://www.abp.io/)中添加Ext Js已有的本地化资源，我实现了一个名为[`extresource`](https://github.com/tianxiaode/GenericAbp/tree/master/src/modules/extresource/src)的模块。该模块会在以上Josn的`Values`添加`key`为`ExtResource`的资源段。

通过json中的`languages`，可以实现一个下拉菜单用来切换语言。

通过json中的`currentCulture`,可以实现日期格式的本地化。

### 类`I18N`

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

在`initLanguages`方法中，会先从`LocalStorage`中获取已保存的语言，如果不存在，则使用浏览器的默认语言作为默认语言。最后，调用`loadResources`方法加载json。

在加载完成后，将加载数据保存到`remoteRawValue`属性，并调用`doOverride`方法更新日期格式。

在`get`方法中，会先根据`resourceName`获取语言文本，如果不存在，则从默认资源段获取，如果也不存在，则从`ExtResource`资源段中获取，如果还不存在，则直接返回`key`。

### 重写`Ext.Component`

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

在`initialize`方法中，如果语言文本已加载，则直接调用`onLocalized`方法刷新显示。无论是否已加载语言文本，都需要绑定`i18nready`事件，已实现语言的动态切换。

在`onLocalized`方法中，会根据`lngHtml`和`lngTooltip`的值，调用`I18N`的`get`方法获取语言文本，然后刷新显示。

方法`getContainerResourceName`的作用是通过往上搜索容器的方式获取`resourceName`。将`resourceName`定义在视图模型中也是一种比较好的方式，因而，方法中还添加了从视图模型中获取`resourceName`的代码。

### 其他

按钮是使用`text`属性来定义显示文本的，因而需要重写按钮`onLocalized`方法。

除了按钮之外，还有`LoadMask`、`Panel`和`Validator`等一些类需要重写。

### 语言切换按钮

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


