Ext.define('Common.shared.util.WeChat',{
    alternateClassName: 'WeChat',
    singleton: true,

    isReady: false,
    weChatConfig:{
        expires: null
    },

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