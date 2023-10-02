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
        this.window.notifyParent(url, me.settings.iframeNotifyParentOrigin);
    }

    

})
  