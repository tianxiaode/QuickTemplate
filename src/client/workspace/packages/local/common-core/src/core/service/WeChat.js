Ext.define('Common.core.service.WeChat',{
    alternateClassName: 'WeChat',
    singleton: true,

    isReady: false,
    weChatConfig:{
        expires: null
    },

    getWeChatConfig(){
        let url = location.href.split('#')[0];
        return Http.get(URI.get('wechat', 'config'), { url: url});
    }

});