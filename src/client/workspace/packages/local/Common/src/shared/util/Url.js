Ext.define('Common.shared.util.Url', {
    alternateClassName: 'URI',
    singleton: true,

    config: {
    },

    constructor: function (config) {
        this.initConfig(config);
        this.callParent(arguments);
    },

    defaultActions: {
        create: 'create',
        read: 'getAll',
        update: 'update',
        destroy: 'delete',
        details: 'get'
    },

    actions: {},

    urlFormat: '{0}{1}/{2}',
    defaultPath: 'api/',
    appName : null,

    getAppName(){
        let me = this,
            appName = me.appName;
        if(!appName){
            let paths = Ext.ClassManager.paths,
                keys = Object.keys(paths);
            appName = keys.find(key => {
                return paths[key] === 'app';
            });
            me.appName = appName;
        }
        return appName;
    },

    getResourcePath(){
        let isDebug = window.location.host.includes('localhost');
        return isDebug ? '/build/development/' + this.getAppName() + '/' : '';
    },
   

    get(controller, action, id, notDefaultPath) {
        let me = this;
        if (!Ext.isString(controller) || Ext.isEmpty(controller)) Ext.raise('Unknown controller name');
        if (!Ext.isString(action) && !Ext.isNumber(action)) Ext.raise('Unknown action name');
        let url =Ext.String.format(
            me.urlFormat, 
            AppConfig.apiUrl + (notDefaultPath ? '' : me.defaultPath), 
            controller, 
            action);
        if(!Ext.isEmpty(id)) url = `${url}/${id}`;
        return url;
    },

    getApi: function (controller, action) {
        var me = this, act, ln, i, result = {};
        action = Ext.isString(action) ? action.toLowerCase() : '';
        ln = action.length;
        for (i = 0; i < ln; i++) {
            act = me.crud[action[i]];
            if (act) {
                result[act] = me.get(controller, act);
            }
        }
        return result;
    },

    resources: {
        logo: 'resources/Common/images/company-logo.png',
        loading: 'resources/Common/images/blue-loading.gif',
        holder: 'resources/Common/images/404.png',
        postcode: 'resources/Common/data/postcode.json',
        provinces: 'resources/Common/data/provinces.json',
        cities: 'resources/Common/data/cities.json',
        districts: 'resources/Common/data/districts.json',
        bankNames: 'resources/Common/data/bankNames.json',
        en: 'resources/Common/locale/en.json',
        'zh-Hans': 'resources/Common/locale/zh-Hans.json',
        'nav': 'resources/Common/data/nav.json',
    },

    getResource: function (res) {
        var me = this;
        return me.getResourcePath() +  me.resources[res];
    }

});
