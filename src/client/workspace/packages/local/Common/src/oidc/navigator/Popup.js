Ext.define('Common.oidc.navigator.Popup', {
    extend: 'Common.oidc.navigator.Abstract',
    alias: 'oidc.navigator.popup',

    requires:[
        'Common.oidc.window.Popup',
    ],

    async prepare(){
        let me = this,
            settings = me.settings,
            popupWindowFeatures = settings.popupWindowFeatures,
            popupWindowTarget = settings.popupWindowTarget;
        me.window = Ext.create('oidc.window.popup', { popupWindowFeatures,  popupWindowTarget});
        return me.window;
    },

    async callback(url, keepOpen){
        this.window.notifyOpener(url, keepOpen);
    }    

})
  