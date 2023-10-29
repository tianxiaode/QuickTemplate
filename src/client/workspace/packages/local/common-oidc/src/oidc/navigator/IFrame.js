Ext.define('Common.oidc.navigator.IFrame', {
    extend: 'Common.oidc.navigator.Abstract',
    alias: 'oidc.navigator.iframe',

    requires:[
        'Common.oidc.window.IFrame',
    ],

    async prepare(){
        let me = this,
            silentRequestTimeoutInSeconds = me.settings.silentRequestTimeoutInSeconds;
        me.window = Ext.create('oidc.window.iframe', { silentRequestTimeoutInSeconds });
        return me.window;
    },

    async callback(url){
        Common.oidc.window.IFrame.notifyParent(url, this.settings.iframeNotifyParentOrigin);
    }

    

})
  