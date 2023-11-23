Ext.define('Common.core.service.Url', {
    alternateClassName: 'URI',
    singleton: true,

    requires:[
        'Common.core.util.Format',
        'Common.core.service.Config'
    ],

    urlFormat: '{0}{1}{2}',
    defaultPath: 'api',

    getResourcePath(){
        let appName = Config.getAppName(),
            isDebug = window.location.host.includes('localhost');
        return isDebug ? `/build/development/${appName}/` : '';
    },
   

    get(isUseDefaultPath, ...args) {
        let me = this,
            url = me.ensureNotSlash(Config.getServer())
            defaultPath = me.ensureNotSlash(me.defaultPath);
        if(isUseDefaultPath !== false){
            url = url + (defaultPath.startsWith('/') ? '' : '/') + defaultPath;
            let first =  Ext.isArray(isUseDefaultPath) ? isUseDefaultPath : [isUseDefaultPath];
            args = [...first, ...args];        
        }

        return `${url}/${args.map(m=>Format.splitCamelCase(m.toString()).toLocaleLowerCase()).join('/')}`;
    },

    ensureNotSlash(str){
        if(!str.endsWith('/')) return str;
        return str.substr(0, str.length -1);
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


    destroy() {
        this.resources = null;
        this.callParent();
        
    }
   

});
