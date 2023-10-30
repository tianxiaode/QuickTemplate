Ext.define('Common.oidc.navigator.Popup', {
    extend: 'Common.oidc.navigator.Abstract',
    alias: 'oidc.navigator.popup',

    requires:[
        'Common.oidc.window.Popup',
    ],

    async prepare(){
        let me = this,
            popupWindowFeatures = me.popupWindowFeatures,
            popupWindowTarget = me.popupWindowTarget;
        me.window = Ext.create('oidc.window.popup', { popupWindowFeatures,  popupWindowTarget});
        return me.window;
    },

    async callback(url, keepOpen){
        Common.oidc.window.Popup.notifyOpener(url, keepOpen);
    }    

})
  