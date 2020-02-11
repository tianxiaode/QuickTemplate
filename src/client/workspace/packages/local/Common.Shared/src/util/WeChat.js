/**
 * 微信功能类
 */
Ext.define('Common.Shared.util.WeChat',{
    alternateClassName: 'WeChat',
    singleton: true,

    isReady: false,
    weChatConfig:{
        expires: null
    },

    /**
     * 获取微信配置
     * @param {回调函数}} callback 
     * @param {作用域} scope 
     */
    getWeChatConfig(callback,scope){
        let url = location.href.split('#')[0];
        //url =url.substring(0,url.length-1);
        //alert(location.href);
        //return;
        Ext.Ajax.request({
            method: 'GET',
            params : { url: encodeURIComponent(url)} ,           
            url: URI.get('WeChat', 'GetConfig'),
            success: callback,
            failure: FAILED.ajax,
            scope: scope,
        })
    },

});