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
    },

    isWeChatBrowser(){
        let userAgent = Ext.browser.userAgent.toLowerCase(),
            result = userAgent.includes('MicroMessenger'.toLowerCase());
        Alert.error(I18N.get('IsMicroMessenger'), true);
        if(!result)  return false;
        Alert.error(I18N.get('IsMicroMessenger'), true);
        return true;
    }


});