/**
 * 地址生成类
 */
Ext.define('Common.Shared.util.Url', {
    alternateClassName: 'URI',
    singleton: true,

    config: {
    },

    constructor: function (config) {
        this.initConfig(config);
        this.callParent(arguments);
    },

    /**
     * crud对应的默认控制器
     */
    defaultActions: {
        create: 'create',
        read: 'getAll',
        update: 'update',
        destroy: 'delete',
        details: 'get'
    },

    actions: {},

    /**
     * url格式
     */
    urlFormat: '{0}{1}/{2}',
    /**
     * 默认路径
     */
    defaultPath: 'api/services/app/',
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

    /**
     * 获取资源路径
     */
    getResourcePath(){
        let isDebug = window.location.host.includes('localhost');
        return isDebug ? '/build/development/' + this.getAppName() + '/' : '';
    },
   
    /**
     * 获取访问地址
     * @param {控制器}} controller 
     * @param {行为}} action 
     * @param {不使用默认路径} notDefaultPath 
     */
    get: function (controller, action, notDefaultPath) {
        var me = this;
        if (!Ext.isString(controller) || Ext.isEmpty(controller)) Ext.raise('Unknown controller name');
        if (!Ext.isString(action) && !Ext.isNumber(action)) Ext.raise('Unknown action name');
        return Ext.String.format(me.urlFormat, ROOTPATH + (notDefaultPath ? '' : me.defaultPath), controller, me.defaultActions[action] || me.actions[action] || action);
    },

    crud: {
        c: 'create',
        r: 'read',
        u: 'update',
        d: 'destroy'
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
        //logo
        logo: 'resources/Common.Shared/images/company-logo.png',  
        //占位图
        holder: 'resources/Common.Shared/images/404.png',
        //邮政编码数据
        postcode: 'resources/Common.Shared/data/postcode.json',
        //省份数据
        provinces: 'resources/Common.Shared/data/provinces.json',
        //城市数据
        cities: 'resources/Common.Shared/data/cities.json',
        //地区数据
        districts: 'resources/Common.Shared/data/districts.json',
    },

    /**
     * 获取资源路径
     * @param {资源名称}} res 
     */
    getResource: function (res) {
        var me = this;
        return me.getResourcePath() +  me.resources[res];
    }

});
