Ext.define('Common.service.Url', {
    alternateClassName: 'URI',
    singleton: true,

    urlFormat: '{0}{1}{2}',
    defaultPath: 'api/',

    getAppName(){
        return Ext.getApplication().getName();
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
    },

    getResource(res) {
        let me = this;
        return me.getResourcePath() +  me.resources[res];
    },

    readParams(url, responseMode){
        if (!url) Ext.raise("Invalid URL");
        // the base URL is irrelevant, it's just here to support relative url arguments
        let parsedUrl = new URL(url, "http://127.0.0.1"),
            params = parsedUrl[responseMode === "fragment" ? "hash" : "search"];
        return new URLSearchParams(params.slice(1));
    },


    doDestroy() {
        let me = this;
        me.resources = null;
    },
   

});
