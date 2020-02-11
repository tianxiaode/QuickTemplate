/**
 * 为Ajax添加头部信息
 */
Ext.define('Common.Shared.util.Headers',{
    alternateClassName: 'HEADERS',
    singleton: true,

    requires:[
        'Ext.util.Cookies'
    ],

    authTokenCookieName : 'Abp.AuthToken',
    authTokenHeaderName : 'Authorization',
    tenantIdCookieName : 'Abp.TenantId',
    tenantIdHeaderName: 'Abp.TenantId',
    cultureTCookieName: 'Abp.Localization.CultureName',
    cultureHeaderName: '.AspNetCore.Culture',
    encrptedAuthTokenName: 'enc_auth_token',

    /**
     * 获取认证token
     */
    getAuthToken: function(){
        var value = Ext.util.Cookies.get(this.authTokenCookieName);
        return value === 'null' ? null : value;
    },

    /**
     * 获取租户Id
     */
    getTenantId: function(){
        //return Ext.util.Cookies.get(this.tenantIdCookieName);
        return 1;
    },

    /**
     * 获取语言信息
     */
    getCulture: function(){
        var lang = LANG;
        if(lang.toLowerCase() === 'zh-cn') lang='zh-Hans';
        return  Ext.String.format('c={0}|uic={0}',lang);
    },

    /**
     * 设置cookie
     * @param {cookie的名称}} name 
     * @param {cookie的值} value 
     * @param {cookie的过期时间} expires 
     * @param {cookie的路径} path 
     */
    setCookies: function(name, value , expires , path  ){
        //Ext.util.Cookies.set(name, value , expires , path );
        Ext.util.Cookies.set(name, value);
    },


    /**
     * 获取Ajax头部需要添加的信息
     * @param {是否包含JSON内容} includeJsonContent 
     */
    getHeaders: function(includeJsonContent){
        var me = this,
            baseHeader = 
                {
                    'Authorization' : 'Bearer ' +  me.getAuthToken(),
                    'Abp.TenantId' : me.getTenantId(),
                    'Accept-Language' : me.getCulture(),
                    'Access-Control-Allow-Origin': '*'
                };
        if(includeJsonContent){
            baseHeader['Content-Type'] = 'application/json;charset=utf-8';
        }
        return baseHeader;
    }

    
});