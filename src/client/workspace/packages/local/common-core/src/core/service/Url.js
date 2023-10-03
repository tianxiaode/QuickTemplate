Ext.define('Common.core.service.Url', {
    alternateClassName: 'URI',
    singleton: true,

    requires:[
        'Common.core.service.Config'
    ],

    urlFormat: '{0}{1}{2}',
    defaultPath: 'api/',

    getResourcePath(){
        let appName = Config.getAppName(),
            isDebug = window.location.host.includes('localhost');
        return isDebug ? `/build/development/${appName}/` : '';
    },
   

    get(isUseDefaultPath, ...args) {
        let me = this,            
            url = AppConfig.apiUrl;
        if(url.endsWith('/')) url = url.substr(0, url.length -1);
        if(isUseDefaultPath !== false){
            url += `/${me.defaultPath}${isUseDefaultPath}`;
        }
        args.forEach(s=>{
            if(Ext.isEmpty(s)) return;
            url += `/${s.toString().toLowerCase()}`;
        })
        return url;
    },

    resources: {
        logo: 'resources/Common/images/company-logo.png',
        loading: 'resources/Common/images/blue-loading.gif',
        holder: 'resources/Common/images/404.png'
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


    destroy() {
        this.resources = null;
        this.callParent();
        
    }
   

});
