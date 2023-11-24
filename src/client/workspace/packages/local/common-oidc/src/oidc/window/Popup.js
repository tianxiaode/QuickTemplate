
Ext.define('Common.oidc.window.Popup', {
    extend: 'Common.oidc.window.Abstract',
    alias: 'oidc.window.popup',

    requires:[
        'Common.oidc.util.Popup',
    ],

    checkForPopupClosedInterval: 500,
    second: 1000,

    defaultFeatures: {
        location: false,
        toolbar: false,
        height: 640,
        closePopupWindowAfterInSeconds: -1
    },

    statics:{
        notifyOpener(url, keepOpen){
            if (!window.opener) {
                Ext.raise("No window.opener. Can't complete notification.");
            }
            return Oidc.Window.notifyParent(window.opener, url, keepOpen);
        }
    },

    constructor(config) {
        let me = this;
        config = config || {};
        me.callParent(arguments);
    
        let features = Ext.apply({}, config && config.features, me.defaultFeatures),
            centeredPopup = Oidc.Popup.center(features),
            target = config.target || '_blank';

        me.window = window.open(undefined, target, Oidc.Popup.serialize(centeredPopup));
        if (features.closePopupWindowAfterInSeconds && features.closePopupWindowAfterInSeconds > 0) {
            setTimeout(() => {
                if (!me.window || typeof me.window.closed !== "boolean" || me.window.closed) {
                    me.abort.raise("Popup blocked by user");
                    return;
                }
                me.close();
            }, features.closePopupWindowAfterInSeconds * me.second);
        }

    },

    async navigate(params) {
        let me = this,
            window = me.window;
        window && window.focus();

        let popupClosedInterval = setInterval(() => {
            if (!window || window.closed) {
                me.abort.raise("Popup closed by user");
            }
        }, me.checkForPopupClosedInterval);
        me.disposeHandlers.add(() => clearInterval(popupClosedInterval));

        return await me.callParent(arguments);
    },

    close(){
        let me = this,
            window = me.window;
        if (window) {
            if (!window.closed) {
                window.close();
                me.abort.raise("Popup closed");
            }
        }
        me.window = null;
    },


    destroy() {
        this.destroyMembers('defaultFeatures', 'window');
        this.callParent();
    }
})
