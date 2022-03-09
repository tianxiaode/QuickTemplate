Ext.define('Common.shared.util.Url', {
    alternateClassName: 'URI',
    singleton: true,

    urlFormat: '{0}{1}{2}',
    defaultPath: 'api/',

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
        let appName = this.getAppName(),
            isDebug = window.location.host.includes('localhost');
        return isDebug ? `/build/development/${appName}/` : '';
    },
   

    get(controller, action, notDefaultPath) {
        let me = this;
        if (!Ext.isString(controller) || Ext.isEmpty(controller)) Ext.raise('Unknown controller name');
        //if (!Ext.isString(action) && !Ext.isNumber(action)) Ext.raise('Unknown action name');
        let url =Ext.String.format(
            me.urlFormat, 
            AppConfig.apiUrl + (notDefaultPath ? '' : me.defaultPath), 
            controller, 
            action ? ('/' + action) : '');
        return url;
    },

    crud(entityName, ...args){
        let path = Format.splitCamelCase(Format.pluralize(entityName)).toLowerCase();
        args.forEach(s=>{
            if(Ext.isEmpty(s)) return;
            path += `/${s.toString().toLowerCase()}`;
        })
        return `${AppConfig.apiUrl}api/${path}`;
    },

    resources: {
        logo: 'resources/Common/images/company-logo.png',
        loading: 'resources/Common/images/blue-loading.gif',
        holder: 'resources/Common/images/404.png',
        md5: 'resources/Common/js/spark-md5.min.js',
        en: 'resources/Common/locale/en.json',
        'zh-Hans': 'resources/Common/locale/zh-Hans.json',
    },

    getResource(res) {
        let me = this;
        return me.getResourcePath() +  me.resources[res];
    }

});
